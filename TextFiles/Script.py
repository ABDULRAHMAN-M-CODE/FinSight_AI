# script to convert file content so that copilot GitHub accept it as valid .txt file
import os

# Input file path

input_file = r"D:\University_slides\GP01\Project_Implementation\FinSight_AI\TextFiles\Database_description.txt"

# Output file path
output_file = r"D:\University_slides\GP01\Project_Implementation\FinSight_AI\Database_description_clean.txt"

with open(input_file, "r", encoding="utf-8", errors="ignore") as f_in, \
     open(output_file, "w", encoding="ascii", errors="ignore") as f_out:
    
    for line in f_in:
        # Replace non-ASCII characters with space
        clean_line = ''.join([c if ord(c) < 128 else ' ' for c in line])
        f_out.write(clean_line)

print(f"Cleaned file saved as: {output_file}")
