import { Item } from "../types";
import * as Array from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import moment from "moment";

const key = "socrate-counter-key";

const chache = () => {
  localStorage.setItem(key, JSON.stringify([]));
};

const reviver = (key: string, value: any) => {
  if (key === "timestamp") return moment(value);
  return value;
};

const all = (): Item[] => {
  return JSON.parse(localStorage.getItem(key) || "[]", reviver);
};

const filter = (pred: (x: Item) => boolean) => {
  return Array.filter<Item>(pred);
};

const filterDay = (date: moment.Moment) => {
  return filter((x) => x.timestamp.isSame(date, "day"));
};

const len = (as: Item[]): number =>
  Array.foldLeft<Item, number>(
    () => 0,
    (_, tail) => 1 + len(tail)
  )(as);

export const insert = (x: Item) => {
  localStorage.setItem(key, JSON.stringify([...all(), x]));
};

export const totalByDay = (date: moment.Moment) => {
  return pipe(all(), filterDay(date), len);
};

export const totalByMonth = (date: moment.Moment) => {
  return pipe(
    all(),
    filter((x) => x.timestamp.isSame(date, "month")),
    len
  );
};

export const totalActual = () => {
  return pipe(
    all(),
    filter((x) => x.in),
    len
  );
};

// export const getItemById = (id: number): Option.Option<Item> => {
//   return Array.findFirst((x: Item) => x.id === id)(all());
// };

// // Return preset with id `id`.
// const getPresetById = (id: string): SignaturePreset | undefined => {
//   return getAllPresets().find((preset: SignaturePreset) => preset.id === id);
// };

// const getPresetsByGroup = (group: string): SignaturePreset[] => {
//   return getAllPresets().filter(
//     (preset: SignaturePreset) => preset.group === group
//   );
// };

// // Return an array of presets with group `group`.
// const getPresetsByUser = (user?: string): SignaturePreset[] => {
//   if (!user) return getPresetsByGroup("everyone");

//   return [...getPresetsByGroup("everyone"), ...getPresetsByGroup(user)];
// };

// // Return the default preset, i.e. the preset with `id=1`.
// const getDefaultPreset = (): SignaturePreset => {
//   const preset: SignaturePreset | undefined = getPresetById("1");
//   if (!preset) throw new Error("Missing default preset.");
//   return preset;
// };

// // Return an array of all presets.
// const getAllPresets = (): SignaturePreset[] => {
//   const userDefinedPresetsString: string | null = localStorage.getItem(
//     localStorageKey
//   );
//   if (!userDefinedPresetsString) {
//     chachePresets();
//   }
//   const presets: SignaturePreset[] = JSON.parse(
//     localStorage.getItem(localStorageKey) || "[]"
//   );
//   return presets.sort((a, b) => parseInt(a.id) - parseInt(b.id));
// };

// // Add given preset to the store.
// const addPreset = (values: Signature, name?: string): void => {
//   const presets: SignaturePreset[] = getAllPresets();
//   const newId: string = (
//     parseInt(
//       presets.reduce((prev, curr) => {
//         return { id: prev.id > curr.id ? prev.id : curr.id, ...curr };
//       }).id
//     ) + 1
//   ).toString();
//   addPresetWithDetails(newId, name || `PRESET ${newId}`, "everyone", values);
// };

// const addPresetWithDetails = (
//   id: string,
//   name: string,
//   group: string,
//   signature: Signature
// ): void => {
//   const presets: SignaturePreset[] = getAllPresets();
//   const newPreset: SignaturePreset = {
//     id: id,
//     name: name,
//     group: group,
//     signature: signature
//   };

//   localStorage.setItem(
//     localStorageKey,
//     JSON.stringify([...presets, newPreset])
//   );
// };

// Remove all user defined presets.
const reset = (): void => {
  chache();
};

// export {
//   getAllPresets,
//   getPresetsByUser,
//   getDefaultPreset,
//   getPresetById,
//   addPreset,
//   resetPresets
// };
