import { Dimension, IDimensions } from "../types";
import { Dimensions } from "./dimensions";

export class Box extends Dimensions {
    children: Box[];
    margin: number;

    constructor(dims: IDimensions, children: Box[] = [], margin = 0) {
        super(dims);

        this.children = children;
        this.margin = margin;
    }

    static from(dimensions: Dimensions) {
        return new Box(dimensions.plain());
    }

    static fromChildren(children: Box[]) {
        const optimalChildren = children.map((child) =>
            child.clone().makeLongest("height").makeShortest("length")
        );

        // eslint-disable-next-line unicorn/no-array-reduce
        const width = optimalChildren.reduce(
            (largest, current) =>
                Math.max(largest, current.dimensionsWithMarginApplied().width),
            0
        );
        // eslint-disable-next-line unicorn/no-array-reduce
        const height = optimalChildren.reduce(
            (largest, current) =>
                Math.max(largest, current.dimensionsWithMarginApplied().height),
            0
        );
        const length = optimalChildren.reduce(
            (accumulator, current) =>
                accumulator + current.dimensionsWithMarginApplied().length,
            0
        );

        return new Box({ width, height, length }, optimalChildren).makeLongest(
            "length",
            ["width", "length"]
        );
    }

    dimensionsWithMarginApplied(): IDimensions {
        return {
            width: this.width + this.margin * 2,
            height: this.height + this.margin * 2,
            length: this.length + this.margin * 2,
        };
    }

    makeLongest(dimension: Dimension, compare?: Dimension[]): Box {
        super.makeLongest(dimension, compare);

        for (const child of this.children) {
            child.makeLongest(dimension, compare);
        }

        return this;
    }

    makeShortest(dimension: Dimension, compare?: Dimension[]): Box {
        super.makeShortest(dimension, compare);

        for (const child of this.children) {
            child.makeShortest(dimension, compare);
        }

        return this;
    }

    swap<T extends Dimension = Dimension>(
        dim1: T,
        dim2: {
            width: "length" | "height";
            height: "length" | "width";
            length: "width" | "height";
        }[T]
    ): Box {
        super.swap(dim1, dim2);

        for (const child of this.children) {
            child.swap(dim1, dim2);
        }

        return this;
    }

    transform(
        transformFunction: (box: Box) => IDimensions & { margin: number }
    ): Box {
        const { width, height, length, margin } = transformFunction(
            this.clone()
        );

        this.width = width;
        this.height = height;
        this.length = length;
        this.margin = margin;

        for (const child of this.children) {
            child.transform(transformFunction);
        }

        return this;
    }

    scale(scaleFactor: number): Box {
        return this.transform((box) => ({
            width: box.width * scaleFactor,
            height: box.height * scaleFactor,
            length: box.length * scaleFactor,
            margin: box.margin * scaleFactor,
        }));
    }

    normalize(unit = 1): Box {
        const { width, height, length } = this.dimensionsWithMarginApplied();

        const largestDimensionValue = Math.max(width, height, length);

        return this.scale(unit / largestDimensionValue);
    }

    clone(): Box {
        return new Box(
            this.plain(),
            this.children.map((child) => child.clone()),
            this.margin
        );
    }
}
