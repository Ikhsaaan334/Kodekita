import type { JalurBagian } from "../types";
import { BAGIAN as PY1 } from "./python/bagian1";
import { BAGIAN as PY2 } from "./python/bagian2";
import { BAGIAN as PY3 } from "./python/bagian3";
import { BAGIAN as PY4 } from "./python/bagian4";
import { BAGIAN as PY5 } from "./python/bagian5";
import { BAGIAN as GO1 } from "./go/bagian1";
import { BAGIAN as GO2 } from "./go/bagian2";
import { BAGIAN as GO3 } from "./go/bagian3";
import { BAGIAN as GO4 } from "./go/bagian4";
import { BAGIAN as GO5 } from "./go/bagian5";
import { BAGIAN as C1 } from "./c/bagian1";
import { BAGIAN as C2 } from "./c/bagian2";
import { BAGIAN as C3 } from "./c/bagian3";
import { BAGIAN as C4 } from "./c/bagian4";
import { BAGIAN as C5 } from "./c/bagian5";
import { BAGIAN as CPP1 } from "./cpp/bagian1";
import { BAGIAN as CPP2 } from "./cpp/bagian2";
import { BAGIAN as CPP3 } from "./cpp/bagian3";
import { BAGIAN as CPP4 } from "./cpp/bagian4";
import { BAGIAN as CPP5 } from "./cpp/bagian5";
import { BAGIAN as JAVA1 } from "./java/bagian1";
import { BAGIAN as JAVA2 } from "./java/bagian2";
import { BAGIAN as JAVA3 } from "./java/bagian3";
import { BAGIAN as JAVA4 } from "./java/bagian4";
import { BAGIAN as JAVA5 } from "./java/bagian5";
import { BAGIAN as PHP1 } from "./php/bagian1";
import { BAGIAN as PHP2 } from "./php/bagian2";
import { BAGIAN as PHP3 } from "./php/bagian3";
import { BAGIAN as PHP4 } from "./php/bagian4";
import { BAGIAN as PHP5 } from "./php/bagian5";
import { BAGIAN as CS1 } from "./csharp/bagian1";
import { BAGIAN as CS2 } from "./csharp/bagian2";
import { BAGIAN as CS3 } from "./csharp/bagian3";
import { BAGIAN as CS4 } from "./csharp/bagian4";
import { BAGIAN as CS5 } from "./csharp/bagian5";

/**
 * Agregator jalur mendalam. Bagian yang belum ditulis tinggal ditambah di sini
 * (C, C++, Java, PHP, C#) tanpa mengubah seed.
 */
export const JALUR: Record<string, JalurBagian[]> = {
  python: [PY1, PY2, PY3, PY4, PY5],
  go: [GO1, GO2, GO3, GO4, GO5],
  c: [C1, C2, C3, C4, C5],
  cpp: [CPP1, CPP2, CPP3, CPP4, CPP5],
  php: [PHP1, PHP2, PHP3, PHP4, PHP5],
  csharp: [CS1, CS2, CS3, CS4, CS5],
  java: [JAVA1, JAVA2, JAVA3, JAVA4, JAVA5],
};
