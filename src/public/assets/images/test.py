import requests

for i in range(1,3):
    data = requests.get(f"https://themesbrand.com/chatvia/layouts/assets/images/small/img-{i}.jpg")

    with open(f"img-{i}.jpg", "wb") as f:
        f.write(data.content)
