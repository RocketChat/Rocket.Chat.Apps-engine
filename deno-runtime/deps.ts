import { generate } from "npm:astring@1.8.6";
import { parse } from "npm:acorn@8.10.0";
import { fullAncestor } from "npm:acorn-walk@8.2.0";

export const astring = { generate };
export const acorn = { parse };
export const acornWalk = { fullAncestor };
