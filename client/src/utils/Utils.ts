const nameof = <T>(key: keyof T): keyof T => key;

const selectFirstOrDefault = <T, TR>(arr: T[], predicate: (t: T) => boolean, select: (t: T) => TR, defaultValue: TR): TR => {
    for (const element of arr) {
        if (predicate(element)) {
            return select(element);
        }
    }
    return defaultValue;
}

export { nameof, selectFirstOrDefault };
