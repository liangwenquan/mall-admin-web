<template> 
  <div>
    <el-upload
      action=""
      :http-request="handUpload"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {policy} from '@/api/common'

  export default {
    name: 'multiUpload',
    props: {
      //图片属性数组
      value: Array,
      //最大上传图片数量
      maxCount:{
        type:Number,
        default:5
      }
    },
    data() {
      return {
        dataObj: {
          name: '',
          url: ''
        },
        dialogVisible: false,
        dialogImageUrl: null,
        fileList: []
      };
    },
    computed: {

    },
    methods: {
      emitInput(fileList) {
        let value=[];
        for(let i=0;i<fileList.length;i++){
          value.push(fileList[i].url);
        }
        console.log('v', value)
        this.$emit('input', value)
      },
      handleRemove(file, fileList) {
        this.emitInput(fileList);
      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl=file.url;
      },
      handUpload(param) {
        let formData = new FormData()
        let _self = this
        formData.append('file', param.file);
        return new Promise((resolve, reject) => {
          policy(formData).then(response => {
            _self.dataObj.name = response.data.name
            _self.dataObj.url = response.data.full_path
            resolve(true)
          }).catch(err => {
            console.log(err)
            reject(false)
          })
        })
      },
      beforeUpload(file) {

      },
      handleUploadSuccess(res, file) {
        this.fileList.push({name: file.name, url: this.dataObj.url});
        this.emitInput(this.fileList);
      },
      handleExceed(files, fileList) {
        this.$message({
          message: '最多只能上传'+this.maxCount+'张图片',
          type: 'warning',
          duration:1000
        });
      },
    }
  }
</script>
<style>

</style>


