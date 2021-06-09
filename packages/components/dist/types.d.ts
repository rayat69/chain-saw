export declare type Requiryfy<Type extends object, Key extends keyof Type> = Required<Pick<Type, Key>> & Omit<Type, Key>;
