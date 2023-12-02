from flask import jsonify

class Prediction:
    def __init__(self,model,result=None,score=None,b64=""):
        self._model=model
        self._result=True if result>0.8 else False
        self._score=round(score,3)
        self._b64=b64

    # Getter method for the _country attribute
    @property
    def model(self):
        return self._model

    # Setter method for the _country attribute
    @model.setter
    def model(self, value):
        self._model = value

    # Deleter method for the _country attribute
    @model.deleter
    def model(self):
        del self._model

    # Getter method for the _result attribute
    @property
    def result(self):
        return self._result

    # Setter method for the _result attribute
    @result.setter
    def result(self, value):
        self._result = value

    # Deleter method for the _result attribute
    @result.deleter
    def result(self):
        del self._result

    # Getter method for the _score attribute
    @property
    def score(self):
        return self._score

    # Setter method for the _score attribute
    @score.setter
    def score(self, value):
        self._score = value

    # Deleter method for the _score attribute
    @score.deleter
    def score(self):
        del self._score

    # Getter method for the _b64 attribute
    @property
    def b64(self):
        return self._b64

    # Setter method for the _b64 attribute
    @b64.setter
    def b64(self, value):
        self._b64 = value

    # Deleter method for the _b64 attribute
    @b64.deleter
    def b64(self):
        del self._b64
    
    def to_jsonify(self):
        return jsonify({
            "model":self._model,
            "result":self._result,
            "score":self._score
        })