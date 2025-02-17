export {};

declare global {
    interface Number {
        format(separator?: string): string;
    }
    interface String {
        capitalize(): string;
    }
}

Number.prototype.format = function (separator = " ") {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator}`);
};

String.prototype.capitalize = function () {
    return this.toLowerCase()
        .split(" ")
        .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");
};
