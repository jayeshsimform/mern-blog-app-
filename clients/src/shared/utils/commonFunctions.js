import { monthNames } from "../constant";

export const convertDate = (date) => {
    if (date) {
        const created_date = new Date(date);
        return `${monthNames[created_date?.getMonth()]} ${created_date?.getDate()},${created_date?.getFullYear()}`;
    }
}

