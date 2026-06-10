import json
class Dog:
    def __init__(self):
        self.name = "Max"

dog = Dog()

json.dumps(dog)