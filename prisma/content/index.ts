import { python } from "./python";
import { go } from "./go";
import { c } from "./c";
import { cpp } from "./cpp";
import { java } from "./java";
import { php } from "./php";
import { csharp } from "./csharp";
import type { TrackContent } from "./types";

export const ALL_TRACKS: TrackContent[] = [python, go, c, cpp, java, php, csharp];
export * from "./types";
