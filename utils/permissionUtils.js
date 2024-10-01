import { PermissionsAndroid, Platform } from "react-native";

const blePermission = [
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
]

async function requestOne(permission){
   
    try {
        const hasPermission = await PermissionsAndroid.check(
            permission
        );
        console.log('结果==>',hasPermission);
        
        if (!hasPermission) {
            const granted = await PermissionsAndroid.request(
                permission,
                {
                    title: '权限请求',
                    message: '是否允许应用使用该权限',
                    buttonNeutral: '取消',
                    buttonNegative: '拒绝',
                    buttonPositive: '允许',
                },
            );
            
            console.log('请求单个权限==>',granted)
            return granted
        }
        console.log('true==>');
        
        return true
    }catch (error) {
        console.log('请求单个权限==>',error)
        return false;  
    }
}

async function requestAll(permissionArr){
   try {

        const grantedPermissions = await PermissionsAndroid.requestMultiple(  
            permissionArr,  
            {  
                title: '权限请求',  
                message: '是否允许应用使用该权限',  
                buttonNeutral: '取消',  
                buttonNegative: '拒绝',  
                buttonPositive: '允许',  
            }  
        );  
        let allGranted = true;  
        for (const key in grantedPermissions) {  
            if (!grantedPermissions[key]) {  
                allGranted = false;  
                break;  
            }  
        } 
        return allGranted;
        

   }catch (error) {
        return false; 
   }
}

const requestPermission = async (permissionArr) => {
   
    
    if (Platform.OS === 'android') {
        if(permissionArr.length === 1){
           return await requestOne(permissionArr[0])
        }else{
           return await requestAll(permissionArr)
        }        

    }else if (Platform.OS === 'ios') {
        

    }
}




export default requestPermission;
export { blePermission };




// READ_CALENDAR: 'android.permission.READ_CALENDAR'
// WRITE_CALENDAR: 'android.permission.WRITE_CALENDAR'
// CAMERA: 'android.permission.CAMERA'
// READ_CONTACTS: 'android.permission.READ_CONTACTS'
// WRITE_CONTACTS: 'android.permission.WRITE_CONTACTS'
// GET_ACCOUNTS: 'android.permission.GET_ACCOUNTS'
// ACCESS_BACKGROUND_LOCATION: 'android.permission.ACCESS_BACKGROUND_LOCATION`
// ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION'
// ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION'
// RECORD_AUDIO: 'android.permission.RECORD_AUDIO'
// READ_PHONE_STATE: 'android.permission.READ_PHONE_STATE'
// CALL_PHONE: 'android.permission.CALL_PHONE'
// READ_CALL_LOG: 'android.permission.READ_CALL_LOG'
// WRITE_CALL_LOG: 'android.permission.WRITE_CALL_LOG'
// ADD_VOICEMAIL: 'com.android.voicemail.permission.ADD_VOICEMAIL'
// USE_SIP: 'android.permission.USE_SIP'
// PROCESS_OUTGOING_CALLS: 'android.permission.PROCESS_OUTGOING_CALLS'
// BODY_SENSORS: 'android.permission.BODY_SENSORS'
// SEND_SMS: 'android.permission.SEND_SMS'
// RECEIVE_SMS: 'android.permission.RECEIVE_SMS'
// READ_SMS: 'android.permission.READ_SMS'
// RECEIVE_WAP_PUSH: 'android.permission.RECEIVE_WAP_PUSH'
// RECEIVE_MMS: 'android.permission.RECEIVE_MMS'
// READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE'
// WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE'