import { Dimensions } from "../../src/structs";
import { IDimensions } from "../../src/types";

describe("Dimensions", () => {
    let dimensions = new Dimensions({ width: 3, height: 2, length: 1 });

    beforeEach(() => {
        dimensions = new Dimensions({ width: 3, height: 2, length: 1 });
    });

    describe("axisToDim", () => {
        it("should return the correct dimension from an axis input", () => {
            expect(Dimensions.axisToDim("x")).toEqual("width");
            expect(Dimensions.axisToDim("y")).toEqual("height");
            expect(Dimensions.axisToDim("z")).toEqual("length");
        });
    });

    describe("dimToAxis", () => {
        it("should return the correct axis from a dimension input", () => {
            expect(Dimensions.dimToAxis("width")).toEqual("x");
            expect(Dimensions.dimToAxis("height")).toEqual("y");
            expect(Dimensions.dimToAxis("length")).toEqual("z");
        });
    });

    describe("plain", () => {
        it("should return a plain object representation of the dimensions", () => {
            expect(dimensions.plain()).toEqual<IDimensions>({
                width: 3,
                height: 2,
                length: 1,
            });
        });

        it("should not return any references to the original properties", () => {
            const plainDims = dimensions.plain();

            plainDims.width = 5;

            expect(dimensions.width).not.toEqual(5);
        });
    });

    describe("longestDimension", () => {
        it("should return the longest dimension", () => {
            expect(dimensions.longestDimension()).toEqual("width");
        });

        it("should return the longest dimension from the compare array if provided", () => {
            expect(dimensions.longestDimension(["height", "length"])).toEqual(
                "height"
            );
        });
    });

    describe("shortestDimension", () => {
        it("should return the shortest dimension", () => {
            expect(dimensions.shortestDimension()).toEqual("length");
        });

        it("should return the shortest dimension from the compare array if provided", () => {
            expect(dimensions.shortestDimension(["width", "height"])).toEqual(
                "height"
            );
        });
    });

    describe("surfaceArea", () => {
        it("should return the correct surface area of a face", () => {
            expect(dimensions.surfaceArea(["x", "y"])).toEqual(6);
        });

        it("should return the correct surface area of the prism", () => {
            expect(dimensions.surfaceArea()).toEqual(22);
        });
    });

    describe("perimeter", () => {
        it("should return the correct perimeter of a face", () => {
            expect(dimensions.perimeter(["x", "y"])).toEqual(10);
        });

        it("should return the correct perimeter of the prism", () => {
            expect(dimensions.perimeter()).toEqual(24);
        });
    });

    describe("update", () => {
        it("should update dimensions properly", () => {
            dimensions.update({ width: 1, height: 1, length: 10 });

            expect(dimensions.width).toEqual(1);
            expect(dimensions.height).toEqual(1);
            expect(dimensions.length).toEqual(10);
        });
    });

    describe("makeLongest", () => {
        it("should intelligently swap dimensions from the compare array if provided", () => {
            dimensions.makeLongest("length", ["height"]);

            expect(dimensions.height).toEqual(1);
            expect(dimensions.length).toEqual(2);
        });
    });

    describe("transform", () => {
        it("should not allow to original instance to be modified from within the callback", () => {
            dimensions.transform((dims) => {
                dims.width = 100;

                expect(dimensions.plain()).toEqual<IDimensions>({
                    width: 3,
                    height: 2,
                    length: 1,
                });

                return dims.plain();
            });

            expect(dimensions.plain()).toEqual<IDimensions>({
                width: 100,
                height: 2,
                length: 1,
            });
        });
    });
});
