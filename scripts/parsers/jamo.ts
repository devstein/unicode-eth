import { JamoShortNames } from "../types";

const parseJamo = (text: string): JamoShortNames =>
  text
    .split(/\n/)
    .filter((line) => line !== "" && !line.startsWith("#"))
    .reduce((acc, line) => {
      const [code, nameWithComment] = line.split(";").map((s) => s.trim());

      // remove trailing comment and trim character name
      const name = nameWithComment.split("#")[0].trim();

      return { ...acc, [code]: name };
    }, {});

export default parseJamo;

// scripts/parsers
// scripts/transformers/enum.ts
// scripts/transformers/category.ts
// scripts/transformers/names.ts
// scripts/transformers/derived.ts
// scripts/utils.ts
