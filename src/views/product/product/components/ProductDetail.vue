<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="product" :rules="rules" ref="productFrom" label-width="150px">
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="product.name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格：" prop="price">
        <el-input v-model="product.price"></el-input>
      </el-form-item>
      <el-form-item label="美甲相册：" prop="cover">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="商品分类：" prop="category_id">
        <el-select
          v-model="product.category_id"
          @change="handleCategoryChange"
          placeholder="请选择分类">
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图文详情：" prop="content">
        <tinymce :width="595" :height="300" v-model="product.content"></tinymce>
      </el-form-item>
      <el-form-item label="权重：" prop="weight">
        <el-input v-model.number="product.weight"></el-input>
      </el-form-item>
      <el-form-item label="是否推荐：">
        <el-radio-group v-model="product.is_recommend">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="product.enabled">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createProduct, getProduct, updateProduct} from '@/api/product'
  import {fetchList as fetchCategoryList} from '@/api/category'
  import MultiUpload from '@/components/Upload/multiUpload'
  import SingleUpload from '@/components/Upload/singleUpload'
  import Tinymce from '@/components/Tinymce'

  const defaultproduct={
    cover: [],
    content: '',
    enabled: 0,
    category_id: '',
    is_recommend: 0,
    name: '',
    weight: '',
    price: ''
  };
  export default {
    name: 'productDetail',
    components:{SingleUpload, MultiUpload, Tinymce},
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        product:Object.assign({}, defaultproduct),
        categoryOptions: [],
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          category_id: [
            {required: true, message: '请输入商品分类', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入商品价格'}
          ],
          content: [
            {required: true, message: '请输入商品详情'}
          ]
        }
      }
    },
    computed: {
      //商品的主图和画册图片
      selectProductPics:{
        get:function () {
          let pics = this.product.cover;
          return pics;
        },
        set:function (newValue) {
          if (newValue == null || newValue.length === 0) {
            this.product.cover = null;
            this.product.covers = null;
          } else {
            this.product.cover = newValue;
          }
        }
      }
    },
    created() {
      if (this.isEdit) {
        getProduct(this.$route.query.id).then(response => {
          this.product = response.data;
        });
      }else{
        this.product = Object.assign({},defaultproduct);
      }
      this.getCategoryList();
    },
    methods: {
      getCategoryList() {
          fetchCategoryList().then(response => {
          this.categoryOptions = [];
          let categoryList = response.data;
          for (let i = 0; i < categoryList.length; i++) {
            this.categoryOptions.push({label: categoryList[i].name, value: categoryList[i].id});
          }
        });
      },
      handleCategoryChange(val) {
        let categoryName = '';
        for (let i = 0; i < this.categoryOptions.length; i++) {
          if (this.categoryOptions[i].value === val) {
            categoryName = this.categoryOptions[i].label;
            break;
          }
        }
        this.product.categoryName = categoryName;
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //需要处理cover参数
              let covers = []
              // 后端不需要完整url，处理掉host
              if (this.product.cover.length > 0) {
                for (let i = 0; i < this.product.cover.length; i ++) {
                  if (this.product.cover[i] != null) {
                    covers.push(this.product.cover[i].replace(process.env.IMAGE_HOST, ''));
                  }
                }
              }
              this.product.covers = covers.join(",")
              if (this.isEdit) {
                updateProduct(this.$route.query.id, this.product).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                createProduct(this.product).then(response => {
                  this.$refs[formName].resetFields();
                  this.product = Object.assign({},defaultproduct);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.push({path:'/product/updateProduct',query:{id:response.data.id}});
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.product = Object.assign({},defaultproduct);
      }
    }
  }
</script>
<style>
</style>


