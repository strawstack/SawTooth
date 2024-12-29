function squares() {
    
    function rot(coords) {
        return coords
            .map(({x, y}) => { return {x: x - 0.5, y: y - 0.5}})
            .map(({x, y}) => { return {x: y, y: -1 * x}; })
            .map(({x, y}) => { return {x: x + 0.5, y: y + 0.5}});
    }

    const data = {};
    data[0b0000] = [];
    data[0b1000] = [{x: 0, y: 0}, {x: 0.5, y: 0}, {x: 0, y: 0.5}];
    data[0b0100] = rot(data[0b1000]);
    data[0b0010] = rot(data[0b0100]);
    data[0b0001] = rot(data[0b0010]);

    data[0b1100] = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 0.5}, {x: 0, y: 0.5}];
    data[0b0110] = rot(data[0b1100]);
    data[0b0011] = rot(data[0b0110]);
    data[0b1001] = rot(data[0b0011]);

    data[0b1010] = [data[0b1000], data[0b0010]];
    data[0b0101] = [data[0b0100], data[0b0001]];

    data[0b0111] = [{x: 0.5, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 0, y: 0.5}];
    data[0b1011] = rot(data[0b0111]);
    data[0b1101] = rot(data[0b1011]);
    data[0b1110] = rot(data[0b1101]);

    data[0b1111] = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}];

    return {
        data
    };
}