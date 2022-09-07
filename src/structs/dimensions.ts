import { Axis, Dimension, IDimensions, Position } from "../types";
import { Bounds } from "../types/bounds";

export class Dimensions implements IDimensions {
    width: number;
    height: number;
    length: number;

    constructor({ width, height, length }: IDimensions) {
        if (!Dimensions.valid({ width, height, length })) {
            throw new Error(
                "Invalid dimensions. All dimensions must be 0 or greater"
            );
        }

        this.width = width;
        this.height = height;
        this.length = length;
    }

    static valid({ width, height, length }: IDimensions): boolean {
        if (width < 0 || height < 0 || length < 0) {
            return false;
        }

        return true;
    }

    static axisToDim(axis: Axis): Dimension {
        return (<Record<Axis, Dimension>>{
            x: "width",
            y: "height",
            z: "length",
        })[axis];
    }

    static dimToAxis(dim: Dimension): Axis {
        return (<Record<Dimension, Axis>>{
            width: "x",
            height: "y",
            length: "z",
        })[dim];
    }

    clone(): Dimensions {
        return new Dimensions({
            width: this.width,
            height: this.height,
            length: this.length,
        });
    }

    plain(): IDimensions {
        const { width, height, length } = this;

        return { width, height, length };
    }

    bounds(startingPoint?: Position): Bounds {
        const start = startingPoint ?? { x: 0, y: 0, z: 0 };

        return [
            start,
            {
                x: start.x + this.width,
                y: start.y + this.height,
                z: start.z + this.length,
            },
        ];
    }

    longestDimension(compare?: Dimension[]): Dimension {
        const dimensionsToCompare: Dimension[] = compare
            ? [...new Set(compare)]
            : ["width", "height", "length"];

        let longest: Dimension | undefined;

        for (const dimension of dimensionsToCompare) {
            const largestValue = longest
                ? this[longest]
                : Number.NEGATIVE_INFINITY;

            if (this[dimension] > largestValue) {
                longest = dimension;
            }
        }

        return longest as Dimension;
    }

    shortestDimension(compare?: Dimension[]): Dimension {
        const dimensionsToCompare: Dimension[] = compare
            ? [...new Set(compare)]
            : ["width", "height", "length"];

        let shortest: Dimension | undefined;

        for (const dimension of dimensionsToCompare) {
            const smallestValue = shortest
                ? this[shortest]
                : Number.POSITIVE_INFINITY;

            if (this[dimension] < smallestValue) {
                shortest = dimension;
            }
        }

        return shortest as Dimension;
    }

    volume(): number {
        return this.length * this.width * this.height;
    }

    surfaceArea<T extends Axis = Axis>(
        face?: [
            T,
            {
                x: "y" | "z";
                y: "x" | "z";
                z: "x" | "y";
            }[T]
        ]
    ): number {
        if (face === undefined) {
            return (
                2 *
                (this.surfaceArea(["x", "y"]) +
                    this.surfaceArea(["y", "z"]) +
                    this.surfaceArea(["x", "z"]))
            );
        }

        return (
            this[Dimensions.axisToDim(face[0])] *
            this[Dimensions.axisToDim(face[1])]
        );
    }

    perimeter<T extends Axis = Axis>(
        face?: [
            T,
            {
                x: "y" | "z";
                y: "x" | "z";
                z: "x" | "y";
            }[T]
        ]
    ): number {
        if (face === undefined) {
            return 4 * (this.width + this.height + this.length);
        }

        return (
            2 *
            (this[Dimensions.axisToDim(face[0])] +
                this[Dimensions.axisToDim(face[1])])
        );
    }

    update(dimensions: Partial<IDimensions>): Dimensions {
        this.width = dimensions.width ?? this.width;
        this.height = dimensions.height ?? this.height;
        this.length = dimensions.length ?? this.length;

        return this;
    }

    makeLongest(dimension: Dimension, compare?: Dimension[]): Dimensions {
        const longestDimension = this.longestDimension(compare);

        if (longestDimension !== dimension) {
            this.swap(longestDimension, dimension);
        }

        return this;
    }

    makeShortest(dimension: Dimension, compare?: Dimension[]): Dimensions {
        const shortestDimension = this.shortestDimension(compare);

        if (shortestDimension !== dimension) {
            this.swap(shortestDimension, dimension);
        }

        return this;
    }

    swap<T extends Dimension = Dimension>(
        dim1: T,
        dim2: {
            width: "height" | "length";
            height: "width" | "length";
            length: "width" | "height";
        }[T]
    ): Dimensions {
        const currentDim1Value = this[dim1];
        const currentDim2Value = this[dim2];

        this[dim1] = currentDim2Value;
        this[dim2] = currentDim1Value;

        return this;
    }

    /**
     * The argument passed to the function is a clone of the current Dimensions instance
     */
    transform(transformFunction: (dimensions: Dimensions) => IDimensions) {
        const result = transformFunction(this.clone());

        return this.update(result);
    }

    scale(scaleFactor: number): Dimensions {
        return this.transform((dimensions) => ({
            width: dimensions.width * scaleFactor,
            height: dimensions.height * scaleFactor,
            length: dimensions.length * scaleFactor,
        }));
    }

    normalize(unit = 1): Dimensions {
        const largestDimensionValue = Math.max(
            this.width,
            this.height,
            this.length
        );

        return this.transform((dimensions) => ({
            width: (dimensions.width / largestDimensionValue) * unit,
            height: (dimensions.height / largestDimensionValue) * unit,
            length: (dimensions.length / largestDimensionValue) * unit,
        }));
    }
}
