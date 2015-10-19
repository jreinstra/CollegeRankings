import json

NUMBER_FIELDS = ["Tuition", "Students", "Percent Male",
                 "Percent Female", "Year Founded", "Endowment",
                 "4 Year Graduation Rate", "Freshman Retention Rate", "Classes Fewer Than 20 Students Percentage",
                 "Classes More Than 50 Students Percentage", "Acceptance Rate", "6 Year Graduation Rate"]

with open("colleges-old.json", "r") as f:
    data=f.read().replace('\n', '')
    
data = json.loads(data)

print data[:1]
for i in range(0, len(data)):
    for field in NUMBER_FIELDS:
        value = data[i][field]
        value = value.replace("$", "")
        value = value.replace(",", "")
        value = value.replace("%", "")
        
        if "out-of-state" in value:
            try:
                value = value[value.index("in-state") + 8:value.index("out-of-state")]
            except ValueError:
                value = value[:value.index("out-of-state")]
        else:
            try:
                result = int(value)
            except ValueError:
                try:
                    result = float(value)
                except ValueError:
                    result = -1
            
        data[i][field] = result
        
print "\n\n", data[:1]

result = json.dumps(data)

f = open("colleges-new.json", "w")
f.write(result)
f.close()