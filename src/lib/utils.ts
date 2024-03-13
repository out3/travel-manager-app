import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {Currency} from "@/types.ts";

// This function is used to merge Tailwind classes with other classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

function getDecimalSeparator() {
    const n = 1.1;
    return n.toLocaleString().substring(1, 2);
}

// This function displays a TransactionValue as a string
export function displayTransactionValue(value: number, currency: Currency) {
    // Format the number of decimals
    const valueFixed = value.toFixed(currency.exponent);
    // Split the whole part and the decimal part
    const [wholePart,...decimalPart] = valueFixed.split('.');

    // Format output
    // Add a space every 3 digits for the whole part
    let output = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    // If there is a decimal part, add it to the output
    if (decimalPart.length > 0) {
        output += getDecimalSeparator() + decimalPart.join('');
    }
    // Add the currency symbol to the output
    output += " " + currency.symbol;

    // Return the result
    return output
}