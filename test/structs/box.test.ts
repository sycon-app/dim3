import { Box } from "../../src/structs";

describe("Box", () => {
    let child = new Box({ width: 3, height: 2, length: 1 }, 1);
    let box = Box.fromChildren([
        child.clone(),
        Box.fromChildren([child.clone(), child.clone()]),
        child.clone(),
    ]);

    beforeEach(() => {
        child = new Box({ width: 3, height: 2, length: 1 }, 1);
        box = box = Box.fromChildren([
            child.clone(),
            Box.fromChildren([child.clone(), child.clone()]),
            child.clone(),
        ]);
    });

    describe("childPositions", () => {
        it("should correctly calculate child positions in a 3D space", () => {
            const positions = box.childPositions();

            expect(positions[positions.length - 1].bounds[1].z).toEqual(
                box.bounds()[1].z
            );
        });

        it("should correctly calculate child positions in a 3D space when the container is normalized", () => {
            const positions = box.normalize().childPositions();

            expect(positions[positions.length - 1].bounds[1].z).toEqual(
                box.bounds()[1].z
            );
        });
    });
});
