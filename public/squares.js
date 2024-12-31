export function squares() {
    
    function rot(coords) {
        return coords
            .map(({x, y}) => { return {x: x - 0.5, y: y - 0.5}})
            .map(({x, y}) => { return {x: y, y: -1 * x}; })
            .map(({x, y}) => { return {x: x + 0.5, y: y + 0.5}});
    }

    const vdata = {};
    vdata[0b0000] = [];
    vdata[0b1000] = [{x: 0, y: 0}, {x: 0.5, y: 0}, {x: 0, y: 0.5}];
    vdata[0b0001] = rot(vdata[0b1000]);
    vdata[0b0010] = rot(vdata[0b0001]);
    vdata[0b0100] = rot(vdata[0b0010]);

    vdata[0b1100] = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 0.5}, {x: 0, y: 0.5}];
    vdata[0b1001] = rot(vdata[0b1100]);
    vdata[0b0011] = rot(vdata[0b1001]);
    vdata[0b0110] = rot(vdata[0b0011]);

    vdata[0b1010] = [vdata[0b1000], vdata[0b0010]];
    vdata[0b0101] = [vdata[0b0100], vdata[0b0001]];

    vdata[0b0111] = [{x: 0.5, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 0, y: 0.5}];
    vdata[0b1110] = rot(vdata[0b0111]);
    vdata[0b1101] = rot(vdata[0b1110]);
    vdata[0b1011] = rot(vdata[0b1101]);

    vdata[0b1111] = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}];

    return {
        data: (n) => {
            if (n === 0b1010) {
                return {
                    type: 'LIST',
                    shape: [
                        vdata[0b1000],
                        vdata[0b0010]
                    ]
                };
            } else if (n === 0b0101) {
                return {
                    type: 'LIST',
                    shape: [
                        vdata[0b0100],
                        vdata[0b0001]
                    ]
                };
            } else {
                return {
                    type: 'SINGLE',
                    shape: vdata[n]
                };
            }
        }
    };
}