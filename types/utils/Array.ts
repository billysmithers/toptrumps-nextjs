class Array {
    public static shuffle(array): any[] {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]
            ];
        }

        return array;
    }

    public static sortByHighestValue(a, b): number {
        if (a.value < b.value) {
            return 1
        }

        if (a.value > b.value) {
            return -1
        }

        return 0
    }
}

export default Array