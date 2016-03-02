import csv
import json

row_names = {
    'Name': 'name',
    'Serving size (g)': 'servingSize',
    'Servings per container': 'perContainer',
    'Total fat (g)': 'fat',
    'Saturated fat (g)': 'fatSaturated',
    'Trans fat (g)': 'fatTrans',
    'poly fat (g)': 'fatPoly',
    'mono fat (g)': 'fatMono',
    'Cholesterol (mg)': 'cholesterol',
    'Sodium (mg)': 'sodium',
    'Potassium (mg)': 'potassium',
    'Total carbs (g)': 'carbs',
    'Fiber (g)': 'carbsFiber',
    'Insoluble Fiber (g)': 'carbsInsolubleFiber',
    'Sugar (g)': 'carbsSugar',
    'Protein (g)': 'protein',
    'Vitamin A (%)': 'vitaminA',
    'Vitamin C (%)': 'vitaminC',
    'Calcium (%)': 'calcium',
    'Iron (%)': 'iron',
    'Vitamin D (%)': 'vitaminD',
    'Vitamin E (%)': 'vitaminE',
    'Thiamin (B1) (%)': 'vitaminB1',
    'Riboflavin (B2) (%)': 'vitaminB2',
    'Niacin (B3) (%)': 'vitaminB3',
    'Vitamin B6 (%)': 'vitaminB6',
    'Vitamin B12 (%)': 'vitaminB12',
    'Magnesium (%)': 'magnesium',
}

output = []

with open('./nutrition.csv', 'rb') as f:
    reader = csv.DictReader(f)
    for row in reader:
        output.append(
            { row_names[k]: v for k, v in row.iteritems() })

with open('./nutrition.js', 'wb') as f:
    f.write('window.data = ')
    json.dump(output, f)
