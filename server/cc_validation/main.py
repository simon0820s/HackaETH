from flask import Flask,request,jsonify
import tensorflow as tf
import tensorflow_hub as hub
import cv2
import numpy as np
from base64 import b64decode
import re
from class_p import Prediction


app=Flask(__name__)

CL_MODEL=tf.keras.models.load_model("CHL_model.hdf5",custom_objects={'KerasLayer':hub.KerasLayer})
CO_MODEL=tf.keras.models.load_model("COL_model.hdf5",custom_objects={'KerasLayer':hub.KerasLayer})

@app.route('/', methods=["POST"])
def upload():
    data=request.get_json()
    img_b64=data.get("image")
    country=data.get("country")
    result,name_model=predict(country,img_b64)

    prediction=Prediction(model=name_model,result=float(result),score=float(result),b64=img_b64)

    return prediction.to_jsonify()

def prepare_img(function):
    def wrapper(country,img_b64):
        img = re.sub('^data:image/.+;base64,', '', img_b64)
        img = np.frombuffer(b64decode(img), dtype=np.uint8)
        img = cv2.imdecode(img, cv2.IMREAD_UNCHANGED)
        img = cv2.resize(img, (224, 224))
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        imgs = np.array([img]).astype(float)/255

        result,name_model=function(country,imgs)

        return result,name_model
    
    return wrapper

@prepare_img
def predict(country,imgs):

    if country=="CL":
        model=CL_MODEL
        name_model="CHL model"

    elif country=="CO":
        model=CO_MODEL
        name_model="COL model"

    result=model.predict(imgs)

    return result,name_model

if __name__ == '__main__':
    app.run(debug=True, port=2809, host='0.0.0.0')