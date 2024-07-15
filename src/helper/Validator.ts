import {p2e} from "./LngConvertor";

export const Validator = (type: string, value: any) => {
    let rgx: RegExp = /(\S)/;

    switch (type) {
        case "email":
            rgx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            break;
        case "mobile":
            rgx = /^[0-9]{10}$/;
            break;
        case "password":
            rgx = /^(?=.{6,}).*$/;
            break;
        default:
            rgx = /(\S)/;
            break;
    }

    return rgx.test(type === "mobile" ? Number(p2e(value)) : value);
}
