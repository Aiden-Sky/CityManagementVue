<template>
  <div class="update-case">
    <h2 class="mb-4">案件进度管理</h2>
    <div v-if="caseItem" class="case-details">
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="case-info-card">
            <h4 class="card-title">案件基本信息</h4>
            <div class="info-item">
              <span class="info-label">案件ID:</span>
              <span class="info-value">{{ caseItem.caseID }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">案件类型:</span>
              <span class="info-value">{{ caseItem.caseType }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">信息大类:</span>
              <span class="info-value">{{ caseItem.infoCategory }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">举报人:</span>
              <span class="info-value">{{ caseItem.reporter }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">联系电话:</span>
              <span class="info-value">{{ caseItem.reporterPhone }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">举报时间:</span>
              <span class="info-value">{{ caseItem.reportTime || '未记录' }}</span>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="case-info-card">
            <h4 class="card-title">位置信息</h4>
            <div class="info-item">
              <span class="info-label">位置:</span>
              <span class="info-value">{{ caseItem.location }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">位置描述:</span>
              <span class="info-value">{{ caseItem.locationDescribe }}</span>
            </div>
            <div class="location-map">
              <img src="https://via.placeholder.com/400x200?text=位置地图" alt="位置地图" class="img-fluid">
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-12">
          <div class="case-info-card">
            <h4 class="card-title">案件描述</h4>
            <p class="description-text">{{ caseItem.description }}</p>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="case-info-card">
            <h4 class="card-title">处理进度</h4>
            <div class="progress-timeline">
              <div class="progress-step" :class="{ 'completed': true }">
                <div class="step-icon">
                  <i class="bi bi-file-earmark-text"></i>
                </div>
                <div class="step-content">
                  <h5>案件创建</h5>
                  <p>{{ caseItem.reportTime || '未记录' }}</p>
                </div>
              </div>
              <div class="progress-step" :class="{ 'completed': isProcessingOrResolved }">
                <div class="step-icon">
                  <i class="bi bi-gear"></i>
                </div>
                <div class="step-content">
                  <h5>开始处理</h5>
                  <p>{{ caseItem.processTime || '未开始' }}</p>
                </div>
              </div>
              <div class="progress-step" :class="{ 'completed': isResolved }">
                <div class="step-icon">
                  <i class="bi bi-check-circle"></i>
                </div>
                <div class="step-content">
                  <h5>案件解决</h5>
                  <p>{{ caseItem.resolveTime || '未完成' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="case-info-card">
            <h4 class="card-title">更新状态</h4>
            <form @submit.prevent="updateCase">
              <div class="mb-3">
                <label for="status" class="form-label">状态</label>
                <select id="status" class="form-select" v-model="updatedStatus">
                  <option value="未处理">未处理</option>
                  <option value="处理中">处理中</option>
                  <option value="待处理">待处理</option>
                  <option value="已解决">已解决</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="handlerName" class="form-label">处理人</label>
                <input type="text" class="form-control" id="handlerName" v-model="handlerName">
              </div>
              <div class="mb-3">
                <label for="updateNote" class="form-label">处理备注</label>
                <textarea class="form-control" id="updateNote" rows="3" v-model="updateNote" placeholder="请输入处理过程和结果..."></textarea>
              </div>
              <div class="mb-3" v-if="updatedStatus === '已解决'">
                <label for="resolutionMethod" class="form-label">解决方法</label>
                <textarea class="form-control" id="resolutionMethod" rows="2" v-model="resolutionMethod" placeholder="请描述如何解决此问题..."></textarea>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="notifyReporter" v-model="notifyReporter">
                <label class="form-check-label" for="notifyReporter">
                  通知举报人状态更新
                </label>
              </div>
              <div class="d-flex justify-content-between">
                <button type="button" class="btn theme-btn-outline" @click="goBack">
                  <i class="bi bi-arrow-left me-1"></i>返回列表
                </button>
                <button type="submit" class="btn theme-btn" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  更新案件状态
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div v-if="showSuccessAlert" class="alert alert-success alert-dismissible fade show mt-4" role="alert">
        <i class="bi bi-check-circle-fill me-2"></i>
        案件状态已成功更新！
        <button type="button" class="btn-close" @click="showSuccessAlert = false" aria-label="Close"></button>
      </div>
    </div>
    <div v-else class="no-case-selected">
      <div class="text-center py-5">
        <i class="bi bi-exclamation-circle display-1 text-muted"></i>
        <h3 class="mt-3">未选择案件</h3>
        <p class="text-muted">请从案件列表中选择一个案件进行处理</p>
        <button class="btn theme-btn-outline mt-3" @click="goBack">返回案件列表</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpdateCase',
  props: {
    caseItem: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      updatedStatus: '',
      handlerName: '',
      updateNote: '',
      resolutionMethod: '',
      notifyReporter: true,
      isSubmitting: false,
      showSuccessAlert: false
    };
  },
  computed: {
    isProcessingOrResolved() {
      return ['处理中', '已解决'].includes(this.caseItem.status);
    },
    isResolved() {
      return this.caseItem.status === '已解决';
    }
  },
  mounted() {
    // 初始化状态为当前案件状态
    this.updatedStatus = this.caseItem.status;
  },
  methods: {
    updateCase() {
      this.isSubmitting = true;
      
      // 模拟API调用
      setTimeout(() => {
        // 在实际应用中，这里应发送请求到服务器更新案件状态
        console.log('更新案件状态:', {
          caseID: this.caseItem.caseID,
          status: this.updatedStatus,
          handler: this.handlerName,
          note: this.updateNote,
          resolutionMethod: this.resolutionMethod,
          notifyReporter: this.notifyReporter
        });
        
        // 更新成功后显示成功提示
        this.showSuccessAlert = true;
        this.isSubmitting = false;
        
        // 5秒后自动关闭提示
        setTimeout(() => {
          this.showSuccessAlert = false;
        }, 5000);
      }, 1000);
    },
    goBack() {
      this.$emit('go-back');
    }
  }
};
</script>

<style scoped>
.update-case {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.case-details {
  padding: 20px;
}

.case-info-card {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.card-title {
  color: var(--theme-color);
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
  font-weight: 600;
}

.info-item {
  margin-bottom: 10px;
  display: flex;
}

.info-label {
  font-weight: 600;
  width: 100px;
  color: #555;
}

.info-value {
  flex: 1;
}

.description-text {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  white-space: pre-line;
}

.location-map {
  margin-top: 15px;
  border-radius: 8px;
  overflow: hidden;
}

.progress-timeline {
  position: relative;
  padding: 20px 0;
}

.progress-timeline::before {
  content: '';
  position: absolute;
  top: 0;
  left: 15px;
  height: 100%;
  width: 2px;
  background-color: #e9ecef;
  z-index: 0;
}

.progress-step {
  position: relative;
  padding-left: 50px;
  margin-bottom: 30px;
}

.progress-step:last-child {
  margin-bottom: 0;
}

.step-icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.step-icon i {
  color: #6c757d;
}

.progress-step.completed .step-icon {
  background-color: var(--theme-color);
}

.progress-step.completed .step-icon i {
  color: white;
}

.step-content {
  padding-bottom: 10px;
}

.step-content h5 {
  margin-bottom: 5px;
  font-size: 1rem;
}

.step-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
}

.no-case-selected {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 主题按钮样式 */
.theme-btn {
  background-color: var(--theme-color, #c3161c);
  border-color: var(--theme-color, #c3161c);
  color: white;
}

.theme-btn:hover {
  background-color: var(--theme-color-dark, #a50f17);
  border-color: var(--theme-color-dark, #a50f17);
  color: white;
}

.theme-btn-outline {
  color: var(--theme-color, #c3161c);
  border-color: var(--theme-color, #c3161c);
  background-color: transparent;
}

.theme-btn-outline:hover {
  background-color: var(--theme-color, #c3161c);
  color: white;
}
</style>
