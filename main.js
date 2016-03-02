const font = "sans-serif";

const realNames = {
    "name": "Name",
    "servingSize": "Serving size (g)",
    "perContainer": "Servings per container",
    "fat": "Total fat (g)",
    "fatSaturated": "Saturated fat (g)",
    "fatTrans": "Trans fat (g)",
    "fatPoly": "poly fat (g)",
    "fatMono": "mono fat (g)",
    "cholesterol": "Cholesterol (mg)",
    "sodium": "Sodium (mg)",
    "potassium": "Potassium (mg)",
    "carbs": "Total carbs (g)",
    "carbsFiber": "Fiber (g)",
    "carbsInsolubleFiber": "Insoluble Fiber (g)",
    "carbsSugar": "Sugar (g)",
    "protein": "Protein (g)",
    "vitaminA": "Vitamin A",
    "vitaminC": "Vitamin C",
    "calcium": "Calcium",
    "iron": "Iron",
    "vitaminD": "Vitamin D",
    "vitaminE": "Vitamin E",
    "vitaminB1": "Thiamin (B1)",
    "vitaminB2": "Riboflavin (B2)",
    "vitaminB3": "Niacin (B3)",
    "vitaminB6": "Vitamin B6",
    "vitaminB12": "Vitamin B12",
    "magnesium": "Magnesium",
};

const CalorieGraph = React.createClass({
    propTypes: {
        fat: React.PropTypes.number,
        carbs: React.PropTypes.number,
        carbsFiber: React.PropTypes.number,
        carbsSugar: React.PropTypes.number,
        protein: React.PropTypes.number,
    },

    arc(ctx, from, to, color) {
        ctx.beginPath();
        ctx.moveTo(75, 75);
        ctx.arc(75, 75, 75, from - Math.PI / 2, to - Math.PI / 2, false);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    },

    label(ctx, label, angle, color) {
        ctx.font = "bold 14px " + font;

        const metrics = ctx.measureText(label);

        const width = metrics.width;
        const height = metrics.actualBoundingBoxAscent || 14;

        const x = 75 + 40 * Math.cos(angle - Math.PI / 2) - width / 2;
        const y = 75 + 40 * Math.sin(angle - Math.PI / 2) + height / 2;

        const border = 5;

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.fillRect(x - border, y - height - border, width + border * 2, height + border * 2);
        ctx.fillStyle = color;
        ctx.fillText(label, x, y);
    },

    componentDidMount() {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        ctx.setTransform(4, 0, 0, 4, 0, 0);

        const {
            fat, carbs, carbsFiber, protein, container
        } = this.props;

        const fatCals = 9 * fat;
        const carbCals = 4 * (carbs - carbsFiber);
        const proteinCals = 4 * protein;

        const totalCals = fatCals + carbCals + proteinCals;

        const fatPercent = fatCals / totalCals;
        const carbPercent = carbCals / totalCals;
        const proteinPercent = proteinCals / totalCals;

        const fatAngle = 2 * Math.PI * (fatCals / totalCals);
        const carbAngle = 2 * Math.PI * (carbCals / totalCals);
        const proteinAngle = 2 * Math.PI * (proteinCals / totalCals);

        const fatColor = "#e84d39";
        const carbColor = "#e07d10";
        const proteinColor = "#134ea3";

        this.arc(ctx, 0, fatAngle, fatColor);
        this.arc(ctx, fatAngle, fatAngle + carbAngle, carbColor);
        this.arc(ctx, fatAngle + carbAngle, 2 * Math.PI, proteinColor);

        const fatLabelAngle = fatAngle / 2;
        const carbLabelAngle = fatAngle + carbAngle / 2;
        const proteinLabelAngle = fatAngle + carbAngle + proteinAngle / 2;

        fatPercent > 0.05 && this.label(ctx, "Fat", fatLabelAngle, fatColor);
        carbPercent > 0.05 && this.label(ctx, "Carbs", carbLabelAngle, carbColor);
        proteinPercent > 0.05 && this.label(ctx, "Protein", proteinLabelAngle, proteinColor);
    },

    render() {
        return <canvas
            ref="canvas"
            width="600"
            height="600"
            style={{
                width: 150,
                height: 150,
            }}
        />;
    },
});

const FoodLabel = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        servingSize: React.PropTypes.number,
        container: React.PropTypes.shape({
            hasContainer: React.PropTypes.bool.isRequired,
            perContainer: React.PropTypes.number,
        }).isRequired,
        fat: React.PropTypes.number,
        fatSaturated: React.PropTypes.number,
        fatTrans: React.PropTypes.number,
        fatPoly: React.PropTypes.number,
        fatMono: React.PropTypes.number,
        cholesterol: React.PropTypes.number,
        sodium: React.PropTypes.number,
        potassium: React.PropTypes.number,
        carbs: React.PropTypes.number,
        carbsFiber: React.PropTypes.number,
        carbsInsolubleFiber: React.PropTypes.number,
        carbsSugar: React.PropTypes.number,
        protein: React.PropTypes.number,
        vitaminA: React.PropTypes.number,
        vitaminC: React.PropTypes.number,
        calcium: React.PropTypes.number,
        iron: React.PropTypes.number,
        vitaminD: React.PropTypes.number,
        vitaminE: React.PropTypes.number,
        vitaminB1: React.PropTypes.number,
        vitaminB2: React.PropTypes.number,
        vitaminB3: React.PropTypes.number,
        vitaminB6: React.PropTypes.number,
        vitaminB12: React.PropTypes.number,
        magnesium: React.PropTypes.number,
    },

    totalCalories() {
        const {
            fat, carbs, carbsFiber, protein, container
        } = this.props;

        const cals = 9 * fat + 4 * (carbs - carbsFiber) + 4 * protein;

        if (container.hasContainer) {
            return cals * container.perContainer;
        } else {
            return cals;
        }
    },

    roundedCalories() {
        const cals = this.totalCalories();
        const roundTo = 5;

        return Math.round(cals / roundTo) * roundTo;
    },

    largestVitamins() {
        const vitaminNames = [
            "vitaminA", "vitaminC", "calcium", "iron", "vitaminD", "vitaminE", "vitaminB1",
            "vitaminB2", "vitaminB3", "vitaminB6", "vitaminB12", "magnesium",
        ];

        const vitamins = vitaminNames.map(name => ({
            name: realNames[name],
            value: this.props[name]
        }));

        const filteredVitamins = vitamins.filter(vit => vit.value > 10);
        const sortedVitamins = filteredVitamins.sort((a, b) => b.value - a.value);

        return sortedVitamins.slice(-4);
    },

    render() {
        return <div className={css(styles.wrapper)}>
            <h1 className={css(styles.title)}>
                <span>{this.props.name}</span>
            </h1>
            <div className={css(styles.body)}>
                <div className={css(styles.calorieWrapper)}>
                    <div className={css(styles.calorieNumber)}>
                        {this.roundedCalories()}
                    </div>
                    <div>
                        Calories
                    </div>
                </div>
                <div className={css(styles.calorieGraphWrapper)}>
                    <CalorieGraph {...this.props} />
                    <div className={css(styles.calorieGraphLabel)}>
                        Calories by nutrient
                    </div>
                </div>
                <div className={css(styles.vitaminsWrapper)}>
                    <div className={css(styles.vitamin)}>
                        <div><span className={css(styles.vitaminNumber)}>{this.props.carbsSugar}</span>g</div>
                        <div>Sugar</div>
                    </div>
                    <div className={css(styles.vitamin)}>
                        <div><span className={css(styles.vitaminNumber)}>{this.props.carbsFiber}</span>g</div>
                        <div>Fiber</div>
                    </div>
                </div>
                <div className={css(styles.vitaminsWrapper)}>
                    {this.largestVitamins().map(({name, value}) => (
                        <div key={name} className={css(styles.vitamin)}>
                            <div>
                                <span className={css(styles.vitaminNumber)}>{value}</span>%
                            </div>
                            <div>
                                {name}
                            </div>
                        </div>))}
                </div>
            </div>
        </div>;
    },
});

const printWidth = 3.5;

const styles = StyleSheet.create({
    wrapper: {
        width: 400,
        height: 500,
        backgroundColor: "white",
        margin: "0 20px 20px 0",
        float: "left",
        boxSizing: "border-box",
        color: "#444",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",

        "@media print": {
            width: `${printWidth}in`,
            height: `${printWidth * 5 / 4 + 1}in`,
            margin: 0,
            outline: "1px solid black",
            paddingTop: "1in",
        },

        pageBreakInside: "avoid",
    },

    title: {
        fontSize: 25,
        textAlign: "center",
        margin: 0,
        padding: "0 20px",
        backgroundColor: "#63d9ea",
        height: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    body: {
        flex: 1,
        padding: 15,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },

    calorieWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    calorieNumber: {
        fontWeight: "bold",
        fontSize: 25,
    },

    calorieGraphWrapper: {
        display: "inline-block",
        textAlign: "center",
    },

    calorieGraphLabel: {
        fontWeight: "bold",
    },

    vitaminsWrapper: {
        display: "flex",
        justifyContent: "space-around",
    },

    vitamin: {
        textAlign: "center",
    },

    vitaminNumber: {
        fontWeight: "bold",
        fontSize: 20,
    },
});

const processedData = data.map(food => {
    const output = {};

    Object.keys(food).forEach(key => {
        if (key === "name") {
            output[key] = food[key];
        } else if (key === "perContainer") {
            if (food[key] === "x") {
                output.container = {
                    hasContainer: false,
                };
            } else {
                output.container = {
                    hasContainer: true,
                    perContainer: parseFloat(food[key]),
                };
            }
        } else if (food[key] === "") {
            output[key] = null;
        } else {
            output[key] = parseFloat(food[key]);
        }
    });

    return output;
});

ReactDOM.render(
    <div>
        {processedData.map(food =>
            <FoodLabel key={food.name} {...food} />)}
    </div>,
    document.getElementById("labels")
);
