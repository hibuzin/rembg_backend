import sys
from rembg import remove
from PIL import Image

input_path = sys.argv[1]
output_path = sys.argv[2]


input_image = Image.open(input_path)


max_size = (1500, 1500)
input_image.thumbnail(max_size)


input_image = input_image.convert("RGB")


output_image = remove(input_image)

output_image.save(output_path, optimize=True, quality=80)