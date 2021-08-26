import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import * as Imagepicker from 'expo-image-picker'

export default class Camera extends React.Component {
    state = {image: null}

    getPermission = async()=>{
      if(Platform.OS !== "web"){
        const{status} =  await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if(status !== "granted"){
          alert("Sorry, we need camera permission to make this work")
        }
      }
    }

    pickImage = async()=>{
        var result = await Imagepicker.launchImageLibraryAsync({
            mediaTypes: Imagepicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,3],quality:1
        })
        if(!result.cancelled){
            this.setState({image:result.data})
            this.uploadImage(result.uri)
        }
    }

    uploadImage = async(uri)=>{
        const data = new FormData()
        var filename = uri.split("/")[uri.split("/").length-1]
        var type = "image/"+uri.split(".")[uri.split(".").length-1]
        const fileupload = {
            uri:uri,
            name:filename,
            type:type
        }
        data.append("digit",fileupload)
        fetch("http://127.0.0.1:5000/predict-digit",{
            method:"POST",
            body:data,
            headers:{"content-type":"multipart/form-data"}
        })
        .then(response=>response.json())
        .then(result=>{
            console.log("success")
        })
        .catch(error=>{
            console.log("error")
        })
    }

  render(){
    return (
      <View style={styles.container}>
        <Button title="Pick an Image" onPress={this.pickImage}></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});