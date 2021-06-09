declare const email: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
declare const name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
declare const fullName: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
declare const age: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
declare const birthDate: import("yup").DateSchema<Date | undefined, Record<string, any>, Date | undefined>;
declare const phone: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
declare const url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
export { email, name, fullName, age, birthDate, phone, url };
