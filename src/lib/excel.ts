import type {
  CalculatorConfig,
  CalculatorField,
  CalculatorResult,
  FieldValue,
} from "@/types/calculator";
import { formatCurrency, safeNumber } from "@/lib/calculator-utils";

const inputSheetName = "입력값";
const pasteSheetName = "붙여넣기용";
const resultSheetName = "계산결과";
const maxPasteCharacters = 80_000;
const maxPasteRows = 500;

const xlsxMimeType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

type HeaderInfo = {
  index: number;
  idIndex: number;
  labelIndex: number;
  valueIndex: number;
};

type CellValue = string | number | boolean | null | undefined;

type SheetDefinition = {
  name: string;
  rows: CellValue[][];
  columnWidths: number[];
  titleRow?: number;
  headerRows?: number[];
  frozenRows?: number;
};

type ZipFile = {
  name: string;
  data: Uint8Array;
};

export type ParsedExcelPaste = {
  values: Record<string, FieldValue>;
  matchedCount: number;
};

export type SummaryExcelRow = {
  title: string;
  status: string;
  total: number;
  summaryOne: string;
  summaryTwo: string;
};

function getNowText() {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
}

function sanitizeFileName(value: string) {
  return (
    value
      .replace(/[\\/:*?"<>|]/g, " ")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "wedding-budget"
  );
}

function getFieldTypeLabel(field: CalculatorField) {
  if (field.type === "money") return "금액";
  if (field.type === "number") return "숫자";
  if (field.type === "percent") return "비율";
  if (field.type === "checkbox") return "예/아니오";
  return "선택";
}

function getOptionGuide(field: CalculatorField) {
  if (field.type === "select") {
    return field.options?.map((option) => option.label).join(", ") || "";
  }

  if (field.type === "checkbox") return "예, 아니오";
  return field.suffix || "";
}

function getDisplayValue(
  field: CalculatorField,
  values: Record<string, FieldValue>,
): CellValue {
  const value = values[field.id] ?? field.defaultValue;

  if (field.type === "select") {
    return (
      field.options?.find((option) => option.value === value)?.label ||
      String(field.defaultValue)
    );
  }

  if (field.type === "checkbox") {
    return Boolean(value) ? "예" : "아니오";
  }

  return safeNumber(value);
}

function getInternalValue(
  field: CalculatorField,
  values: Record<string, FieldValue>,
) {
  const value = values[field.id] ?? field.defaultValue;
  return typeof value === "boolean"
    ? value
      ? "true"
      : "false"
    : String(value);
}

function sanitizeSpreadsheetText(value: string) {
  const normalized = value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");
  return /^[=+\-@\t\r]/.test(normalized) ? `'${normalized}` : normalized;
}

function escapeXml(value: unknown) {
  return sanitizeSpreadsheetText(String(value ?? "")).replace(
    /[&<>"]/g,
    (character) => {
      if (character === "&") return "&amp;";
      if (character === "<") return "&lt;";
      if (character === ">") return "&gt;";
      return "&quot;";
    },
  );
}

function columnName(index: number) {
  let current = index;
  let name = "";

  while (current > 0) {
    const remainder = (current - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    current = Math.floor((current - 1) / 26);
  }

  return name;
}

function cellReference(rowNumber: number, columnNumber: number) {
  return `${columnName(columnNumber)}${rowNumber}`;
}

function createCellXml(
  value: CellValue,
  rowNumber: number,
  columnNumber: number,
  styleId: number,
) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const reference = cellReference(rowNumber, columnNumber);
  const styleAttribute = styleId > 0 ? ` s="${styleId}"` : "";

  if (typeof value === "number") {
    return `<c r="${reference}"${styleAttribute}><v>${safeNumber(value)}</v></c>`;
  }

  if (typeof value === "boolean") {
    return `<c r="${reference}" t="b"${styleAttribute}><v>${value ? 1 : 0}</v></c>`;
  }

  return `<c r="${reference}" t="inlineStr"${styleAttribute}><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
}

function getCellStyleId(
  value: CellValue,
  rowNumber: number,
  titleRow?: number,
  headerRows?: Set<number>,
) {
  if (titleRow === rowNumber) return 1;
  if (headerRows?.has(rowNumber)) return 2;
  if (typeof value === "number") return 3;
  return 4;
}

function createSheetXml(sheet: SheetDefinition) {
  const maxColumns = Math.max(
    sheet.columnWidths.length,
    ...sheet.rows.map((row) => row.length),
  );
  const lastCell = cellReference(Math.max(1, sheet.rows.length), maxColumns);
  const headerRows = new Set(sheet.headerRows || []);
  const cols = sheet.columnWidths
    .map(
      (width, index) =>
        `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`,
    )
    .join("");
  const sheetViews = sheet.frozenRows
    ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="${sheet.frozenRows}" topLeftCell="A${sheet.frozenRows + 1}" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft"/></sheetView></sheetViews>`
    : '<sheetViews><sheetView workbookViewId="0"/></sheetViews>';
  const rows = sheet.rows
    .map((row, rowIndex) => {
      const rowNumber = rowIndex + 1;
      const height = sheet.titleRow === rowNumber ? ' ht="30" customHeight="1"' : "";
      const cells = row
        .map((value, columnIndex) =>
          createCellXml(
            value,
            rowNumber,
            columnIndex + 1,
            getCellStyleId(value, rowNumber, sheet.titleRow, headerRows),
          ),
        )
        .join("");
      return `<row r="${rowNumber}"${height}>${cells}</row>`;
    })
    .join("");
  const mergeXml =
    sheet.titleRow && maxColumns > 1
      ? `<mergeCells count="1"><mergeCell ref="A${sheet.titleRow}:${columnName(maxColumns)}${sheet.titleRow}"/></mergeCells>`
      : "";

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="A1:${lastCell}"/>
  ${sheetViews}
  <sheetFormatPr defaultRowHeight="18"/>
  <cols>${cols}</cols>
  <sheetData>${rows}</sheetData>
  ${mergeXml}
  <pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>
</worksheet>`;
}

function createStylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="3">
    <font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/></font>
    <font><b/><sz val="16"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
  </fonts>
  <fills count="4">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFE11D48"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFBE123C"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border><left style="thin"><color rgb="FFFFE4E6"/></left><right style="thin"><color rgb="FFFFE4E6"/></right><top style="thin"><color rgb="FFFFE4E6"/></top><bottom style="thin"><color rgb="FFFFE4E6"/></bottom><diagonal/></border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="5">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="3" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
  <dxfs count="0"/>
  <tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/>
</styleSheet>`;
}

function createWorkbookXml(sheets: SheetDefinition[]) {
  const activeTab = Math.min(2, Math.max(0, sheets.length - 1));
  const sheetList = sheets
    .map(
      (sheet, index) =>
        `<sheet name="${escapeXml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`,
    )
    .join("");

return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <workbookPr date1904="false"/>
  <bookViews><workbookView activeTab="${activeTab}"/></bookViews>
  <sheets>${sheetList}</sheets>
</workbook>`;
}

function createWorkbookRelsXml(sheets: SheetDefinition[]) {
  const worksheetRels = sheets
    .map(
      (_, index) =>
        `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${worksheetRels}
  <Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
}

function createRootRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
}

function createContentTypesXml(sheets: SheetDefinition[]) {
  const worksheetOverrides = sheets
    .map(
      (_, index) =>
        `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  ${worksheetOverrides}
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;
}

function createCorePropsXml(config: CalculatorConfig) {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${escapeXml(config.title)}</dc:title>
  <dc:subject>웨딩·신혼 예산 계산기 입력값과 계산 결과</dc:subject>
  <dc:creator>Wedding Budget Calculator</dc:creator>
  <cp:keywords>${escapeXml(config.keywords.join(", "))}</cp:keywords>
  <cp:lastModifiedBy>Wedding Budget Calculator</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`;
}

function createAppPropsXml(sheets: SheetDefinition[]) {
  const sheetTitles = sheets
    .map((sheet) => `<vt:lpstr>${escapeXml(sheet.name)}</vt:lpstr>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Wedding Budget Calculator</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>${sheets.length}</vt:i4></vt:variant></vt:vector></HeadingPairs>
  <TitlesOfParts><vt:vector size="${sheets.length}" baseType="lpstr">${sheetTitles}</vt:vector></TitlesOfParts>
  <Company></Company>
  <LinksUpToDate>false</LinksUpToDate>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>16.0300</AppVersion>
</Properties>`;
}

function createInputSheet(
  config: CalculatorConfig,
  values: Record<string, FieldValue>,
): SheetDefinition {
  return {
    name: inputSheetName,
    columnWidths: [28, 18, 14, 18, 34, 44, 18],
    titleRow: 1,
    headerRows: [6],
    frozenRows: 6,
    rows: [
      [`${config.shortTitle} 입력값`, "", "", "", "", "", ""],
      ["계산기 ID", config.slug],
      ["계산기 제목", config.title],
      ["생성일", getNowText()],
      [
        "안내",
        "D열 입력값만 수정한 뒤 붙여넣기용 시트 또는 이 표의 A:D 범위를 복사해 계산기 페이지의 엑셀 붙여넣기 상자에 붙여넣으세요.",
      ],
      [
        "항목명",
        "그룹",
        "유형",
        "입력값",
        "선택 가능 값/단위",
        "도움말",
        "내부값",
      ],
      ...config.fields.map((field) => [
        field.label,
        field.group || "기본 입력",
        getFieldTypeLabel(field),
        getDisplayValue(field, values),
        getOptionGuide(field),
        field.helpText || "",
        getInternalValue(field, values),
      ]),
    ],
  };
}

function createPasteSheet(
  config: CalculatorConfig,
  values: Record<string, FieldValue>,
): SheetDefinition {
  return {
    name: pasteSheetName,
    columnWidths: [30, 18, 54],
    titleRow: 1,
    headerRows: [4],
    frozenRows: 4,
    rows: [
      [`${config.shortTitle} 붙여넣기용`, "", ""],
      [
        "계산기 ID",
        config.slug,
        "",
        "다른 계산기 페이지에서는 이 데이터가 차단될 수 있습니다.",
      ],
      [
        "안내",
        "아래 입력값을 수정한 뒤 A:B 범위를 복사하세요.",
        "",
        "사이트의 ‘엑셀 붙여넣기’ 상자에 붙여넣으면 현재 브라우저에서만 반영됩니다.",
      ],
      ["항목명", "입력값", "입력 안내"],
      ...config.fields.map((field) => [
        field.label,
        getDisplayValue(field, values),
        [getOptionGuide(field), field.helpText].filter(Boolean).join(" · "),
      ]),
    ],
  };
}

function createResultSheet(result: CalculatorResult): SheetDefinition {
  const rows: CellValue[][] = [
    [`${result.primaryLabel} 계산 결과`, "", "", ""],
    ["생성일", getNowText(), "", ""],
    [result.primaryLabel, formatCurrency(result.total), "", ""],
    [],
    ["요약", "값", "", "설명"],
  ];
  const headerRows = [5];

  result.summary.forEach((item) => {
    rows.push([item.label, item.value, "", item.description || ""]);
  });

  rows.push([]);
  rows.push(["항목", "금액", "분류", "비고"]);
  headerRows.push(rows.length);

  result.items.forEach((item) => {
    rows.push([
      item.label,
      item.amount,
      item.category,
      item.required ? "필수" : "",
    ]);
  });

  rows.push([]);
  rows.push(["예산 안내", "", "", ""]);
  headerRows.push(rows.length);
  result.advice.forEach((advice) => rows.push([advice, "", "", ""]));

  if (result.disclaimer) {
    rows.push([result.disclaimer, "", "", ""]);
  }

  return {
    name: resultSheetName,
    columnWidths: [28, 24, 24, 52],
    titleRow: 1,
    headerRows,
    rows,
  };
}

const textEncoder = new TextEncoder();

function encodeText(value: string) {
  return textEncoder.encode(value);
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let crc = index;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    table[index] = crc >>> 0;
  }
  return table;
})();

function calculateCrc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function getDosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  const dosTime =
    (date.getHours() << 11) |
    (date.getMinutes() << 5) |
    Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { dosTime, dosDate };
}

function writeUint16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function writeUint32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value >>> 0, true);
}

function concatUint8Arrays(parts: Uint8Array[]) {
  const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }

  return result;
}

function createZip(files: ZipFile[]) {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;
  const { dosTime, dosDate } = getDosDateTime();

  files.forEach((file) => {
    const nameBytes = encodeText(file.name);
    const crc = calculateCrc32(file.data);
    const flags = 0x0800;
    const compression = 0;

    const localHeader = new Uint8Array(30);
    const localView = new DataView(localHeader.buffer);
    writeUint32(localView, 0, 0x04034b50);
    writeUint16(localView, 4, 20);
    writeUint16(localView, 6, flags);
    writeUint16(localView, 8, compression);
    writeUint16(localView, 10, dosTime);
    writeUint16(localView, 12, dosDate);
    writeUint32(localView, 14, crc);
    writeUint32(localView, 18, file.data.length);
    writeUint32(localView, 22, file.data.length);
    writeUint16(localView, 26, nameBytes.length);
    writeUint16(localView, 28, 0);

    localParts.push(localHeader, nameBytes, file.data);

    const centralHeader = new Uint8Array(46);
    const centralView = new DataView(centralHeader.buffer);
    writeUint32(centralView, 0, 0x02014b50);
    writeUint16(centralView, 4, 20);
    writeUint16(centralView, 6, 20);
    writeUint16(centralView, 8, flags);
    writeUint16(centralView, 10, compression);
    writeUint16(centralView, 12, dosTime);
    writeUint16(centralView, 14, dosDate);
    writeUint32(centralView, 16, crc);
    writeUint32(centralView, 20, file.data.length);
    writeUint32(centralView, 24, file.data.length);
    writeUint16(centralView, 28, nameBytes.length);
    writeUint16(centralView, 30, 0);
    writeUint16(centralView, 32, 0);
    writeUint16(centralView, 34, 0);
    writeUint16(centralView, 36, 0);
    writeUint32(centralView, 38, 0);
    writeUint32(centralView, 42, offset);

    centralParts.push(centralHeader, nameBytes);
    offset += localHeader.length + nameBytes.length + file.data.length;
  });

  const centralDirectory = concatUint8Arrays(centralParts);
  const endOfCentralDirectory = new Uint8Array(22);
  const eocdView = new DataView(endOfCentralDirectory.buffer);
  writeUint32(eocdView, 0, 0x06054b50);
  writeUint16(eocdView, 4, 0);
  writeUint16(eocdView, 6, 0);
  writeUint16(eocdView, 8, files.length);
  writeUint16(eocdView, 10, files.length);
  writeUint32(eocdView, 12, centralDirectory.length);
  writeUint32(eocdView, 16, offset);
  writeUint16(eocdView, 20, 0);

  return concatUint8Arrays([
    ...localParts,
    centralDirectory,
    endOfCentralDirectory,
  ]);
}

function createWorkbookFiles(
  config: CalculatorConfig,
  values: Record<string, FieldValue>,
  result: CalculatorResult,
): ZipFile[] {
  const sheets = [
    createInputSheet(config, values),
    createPasteSheet(config, values),
    createResultSheet(result),
  ];

  return [
    { name: "[Content_Types].xml", data: encodeText(createContentTypesXml(sheets)) },
    { name: "_rels/.rels", data: encodeText(createRootRelsXml()) },
    { name: "docProps/core.xml", data: encodeText(createCorePropsXml(config)) },
    { name: "docProps/app.xml", data: encodeText(createAppPropsXml(sheets)) },
    { name: "xl/workbook.xml", data: encodeText(createWorkbookXml(sheets)) },
    { name: "xl/_rels/workbook.xml.rels", data: encodeText(createWorkbookRelsXml(sheets)) },
    { name: "xl/styles.xml", data: encodeText(createStylesXml()) },
    ...sheets.map((sheet, index) => ({
      name: `xl/worksheets/sheet${index + 1}.xml`,
      data: encodeText(createSheetXml(sheet)),
    })),
  ];
}

export async function downloadCalculatorExcel(
  config: CalculatorConfig,
  values: Record<string, FieldValue>,
  result: CalculatorResult,
) {
  if (typeof window === "undefined") return;

  const zipBytes = createZip(createWorkbookFiles(config, values, result));
  const blob = new Blob([zipBytes], { type: xlsxMimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitizeFileName(config.shortTitle)}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function createSummarySheet(rows: SummaryExcelRow[]): SheetDefinition {
  return {
    name: "전체결과",
    columnWidths: [28, 14, 18, 38, 38],
    titleRow: 1,
    headerRows: [3],
    frozenRows: 3,
    rows: [
      ["전체 결과 표", "", "", "", ""],
      ["생성일", getNowText(), "", "", ""],
      ["계산기", "상태", "합계", "보조 결과 1", "보조 결과 2"],
      ...rows.map((row) => [
        row.title,
        row.status,
        row.total,
        row.summaryOne,
        row.summaryTwo,
      ]),
    ],
  };
}

function createSummaryWorkbookFiles(rows: SummaryExcelRow[]): ZipFile[] {
  const sheets = [createSummarySheet(rows)];
  const summaryConfig = {
    title: "웨딩·신혼 예산 통합 요약",
    shortTitle: "통합 예산 요약",
    keywords: ["웨딩 예산 요약", "결혼 예산 통합", "전체 결과 표"],
  } as CalculatorConfig;

  return [
    { name: "[Content_Types].xml", data: encodeText(createContentTypesXml(sheets)) },
    { name: "_rels/.rels", data: encodeText(createRootRelsXml()) },
    { name: "docProps/core.xml", data: encodeText(createCorePropsXml(summaryConfig)) },
    { name: "docProps/app.xml", data: encodeText(createAppPropsXml(sheets)) },
    { name: "xl/workbook.xml", data: encodeText(createWorkbookXml(sheets)) },
    { name: "xl/_rels/workbook.xml.rels", data: encodeText(createWorkbookRelsXml(sheets)) },
    { name: "xl/styles.xml", data: encodeText(createStylesXml()) },
    ...sheets.map((sheet, index) => ({
      name: `xl/worksheets/sheet${index + 1}.xml`,
      data: encodeText(createSheetXml(sheet)),
    })),
  ];
}

export async function downloadSummaryExcel(rows: SummaryExcelRow[]) {
  if (typeof window === "undefined") return;

  const zipBytes = createZip(createSummaryWorkbookFiles(rows));
  const blob = new Blob([zipBytes], { type: xlsxMimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `통합-예산-요약-${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function normalizeText(value: unknown) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .trim();
}

function normalizeHeader(value: unknown) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[\s:_\-\/()\[\]]/g, "");
}

function parseNumberLike(raw: unknown) {
  if (typeof raw === "number") return safeNumber(raw);
  if (typeof raw === "boolean") return raw ? 1 : 0;

  const text = normalizeText(raw).replace(/,/g, "");
  const match = text.match(/\d+(?:\.\d+)?/);
  return safeNumber(match ? Number(match[0]) : 0);
}

function parseCheckboxLike(raw: unknown) {
  if (typeof raw === "boolean") return raw;
  if (typeof raw === "number") return raw > 0;

  const text = normalizeText(raw).toLowerCase();
  if (
    ["true", "yes", "y", "1", "예", "네", "o", "ok", "사용", "참"].includes(
      text,
    )
  )
    return true;
  if (
    [
      "false",
      "no",
      "n",
      "0",
      "아니오",
      "아니요",
      "x",
      "미사용",
      "거짓",
    ].includes(text)
  )
    return false;
  return false;
}

function parseSelectLike(field: CalculatorField, raw: unknown) {
  const text = normalizeText(raw);
  const normalizedText = normalizeHeader(text);
  const option = field.options?.find(
    (item) =>
      item.value === text ||
      item.label === text ||
      normalizeHeader(item.label) === normalizedText,
  );
  return option?.value || field.defaultValue;
}

function parseFieldValue(field: CalculatorField, raw: unknown): FieldValue {
  if (field.type === "money" || field.type === "number")
    return parseNumberLike(raw);
  if (field.type === "percent") return Math.min(100, parseNumberLike(raw));
  if (field.type === "checkbox") return parseCheckboxLike(raw);
  return parseSelectLike(field, raw);
}

function chooseDelimiter(text: string) {
  const lines = text.split(/\r?\n/).slice(0, 10);
  if (lines.some((line) => line.includes("\t"))) return "\t";

  const commaSeparatedHeader = lines.some((line) => {
    const cells = line.split(",");
    return cells.some(isValueHeader) && (cells.some(isIdHeader) || cells.some(isLabelHeader));
  });

  return commaSeparatedHeader ? "," : "\t";
}

function parseDelimitedRows(text: string, delimiter: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  rows.push(row);

  return rows
    .map((item) => item.map((value) => normalizeText(value)))
    .filter((item) => item.some((value) => value.length > 0));
}

function isIdHeader(value: unknown) {
  return ["항목id", "항목아이디", "fieldid", "필드id", "id"].includes(
    normalizeHeader(value),
  );
}

function isLabelHeader(value: unknown) {
  return ["항목명", "항목", "label", "name", "이름"].includes(
    normalizeHeader(value),
  );
}

function isValueHeader(value: unknown) {
  return ["입력값", "값", "value", "amount", "금액", "입력"].includes(
    normalizeHeader(value),
  );
}

function findMetadataSlug(rows: string[][]) {
  for (const row of rows.slice(0, 20)) {
    const firstCell = normalizeHeader(row[0]);
    if (
      ["계산기id", "계산기아이디", "calculatorid", "slug"].includes(firstCell)
    ) {
      return normalizeText(row[1]);
    }
  }

  return "";
}

function findHeaderInfo(rows: string[][]): HeaderInfo | null {
  for (let index = 0; index < Math.min(rows.length, 40); index += 1) {
    const row = rows[index];
    const idIndex = row.findIndex(isIdHeader);
    const labelIndex = row.findIndex(isLabelHeader);
    const valueIndex = row.findIndex(isValueHeader);

    if (valueIndex >= 0 && (idIndex >= 0 || labelIndex >= 0)) {
      return { index, idIndex, labelIndex, valueIndex };
    }
  }

  return null;
}

function getFieldFromRow(
  row: string[],
  config: CalculatorConfig,
  idIndex: number,
  labelIndex: number,
) {
  const fieldMap = new Map(config.fields.map((field) => [field.id, field]));
  const normalizedLabelMap = new Map(
    config.fields.map((field) => [normalizeHeader(field.label), field]),
  );

  if (idIndex >= 0) {
    const field = fieldMap.get(normalizeText(row[idIndex]));
    if (field) return field;
  }

  if (labelIndex >= 0) {
    const field = normalizedLabelMap.get(normalizeHeader(row[labelIndex]));
    if (field) return field;
  }

  const firstCell = normalizeText(row[0]);
  return fieldMap.get(firstCell) || normalizedLabelMap.get(normalizeHeader(firstCell)) || null;
}

function getFallbackValueCell(row: string[]) {
  if (row.length >= 5) return row[4];
  if (row.length >= 3) return row[2];
  if (row.length >= 2) return row[1];
  return "";
}

function parseRowsWithHeaders(
  rows: string[][],
  config: CalculatorConfig,
  headerInfo: HeaderInfo,
) {
  const imported: Record<string, FieldValue> = {};

  for (const row of rows.slice(headerInfo.index + 1)) {
    const field = getFieldFromRow(
      row,
      config,
      headerInfo.idIndex,
      headerInfo.labelIndex,
    );
    if (!field) continue;
    imported[field.id] = parseFieldValue(field, row[headerInfo.valueIndex]);
  }

  return imported;
}

function parseRowsByKnownField(rows: string[][], config: CalculatorConfig) {
  const imported: Record<string, FieldValue> = {};

  for (const row of rows) {
    const field = getFieldFromRow(row, config, 0, 0);
    if (!field) continue;
    imported[field.id] = parseFieldValue(field, getFallbackValueCell(row));
  }

  return imported;
}

function parseSingleColumnRows(rows: string[][], config: CalculatorConfig) {
  const singleColumnValues = rows
    .filter(
      (row) =>
        row.length === 1 ||
        row.slice(1).every((cell) => normalizeText(cell).length === 0),
    )
    .map((row) => row[0]);

  if (singleColumnValues.length === 0) return {};

  const startIndex = isValueHeader(singleColumnValues[0]) ? 1 : 0;
  const rawValues = singleColumnValues.slice(
    startIndex,
    startIndex + config.fields.length,
  );

  if (rawValues.length < Math.min(3, config.fields.length)) return {};

  return rawValues.reduce<Record<string, FieldValue>>(
    (acc, rawValue, index) => {
      const field = config.fields[index];
      if (field) acc[field.id] = parseFieldValue(field, rawValue);
      return acc;
    },
    {},
  );
}

export function parseExcelPastedText(
  text: string,
  config: CalculatorConfig,
): ParsedExcelPaste {
  if (!text.trim()) {
    throw new Error("엑셀에서 복사한 표 데이터를 붙여넣어주세요.");
  }

  if (text.length > maxPasteCharacters) {
    throw new Error(
      "붙여넣기 데이터가 너무 큽니다. 필요한 입력값 표만 복사해주세요.",
    );
  }

  const rows = parseDelimitedRows(text, chooseDelimiter(text));

  if (rows.length === 0) {
    throw new Error("붙여넣은 데이터에서 읽을 수 있는 행을 찾지 못했습니다.");
  }

  if (rows.length > maxPasteRows) {
    throw new Error(
      "붙여넣기 행이 너무 많습니다. 필요한 입력값 표만 복사해주세요.",
    );
  }

  const metadataSlug = findMetadataSlug(rows);
  if (metadataSlug && metadataSlug !== config.slug) {
    throw new Error(
      "현재 계산기와 다른 엑셀 데이터입니다. 같은 계산기 페이지에서 붙여넣어주세요.",
    );
  }

  const headerInfo = findHeaderInfo(rows);
  let imported = headerInfo
    ? parseRowsWithHeaders(rows, config, headerInfo)
    : parseRowsByKnownField(rows, config);

  if (Object.keys(imported).length === 0) {
    imported = parseSingleColumnRows(rows, config);
  }

  const matchedCount = Object.keys(imported).length;
  if (matchedCount === 0) {
    throw new Error(
      "가져올 수 있는 계산기 입력 항목을 찾지 못했습니다. 항목명과 입력값을 함께 복사해주세요.",
    );
  }

  return { values: imported, matchedCount };
}

export function getExcelPastePolicyText() {
  return "엑셀 파일을 업로드하지 않고, 복사한 표 데이터만 현재 브라우저에서 해석합니다.";
}
