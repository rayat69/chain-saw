/// <reference types="react" />
export declare const statusCodes: {
    400: string;
    401: string;
    403: string;
    404: string;
    405: string;
    500: string;
};
export declare const errorStyles: import("@material-ui/styles").StyleRules<{}, "error" | "message" | "code" | "desc" | "@global">;
export declare const ErrorPage: ({ statusCode, title }: ErrorProps) => JSX.Element;
export interface ErrorProps {
    statusCode: keyof typeof statusCodes;
    title?: string;
}
