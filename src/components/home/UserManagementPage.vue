<template>
  <div class="container mt-5">
    <!-- 切换用户类型的选项卡 -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'residents' }" @click="activeTab = 'residents'">管理市民</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'cityManagers' }" @click="activeTab = 'cityManagers'">管理城市管理者</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'admin' }" @click="activeTab = 'admin'">系统总管</a>
      </li>
    </ul>

    <!-- 管理市民界面 -->
    <div v-if="activeTab === 'residents'">
      <div class="d-flex justify-content-between mb-4">
        <button class="btn btn-success mb-3" @click="openResidentModal(null)">新建市民</button>
        <div class="d-flex">
          <div class="me-3">
            <label for="filterResidentName" class="form-label">姓名:</label>
            <input type="text" class="form-control" id="filterResidentName" v-model="filters.residentName" placeholder="请输入姓名">
          </div>
          <div class="me-3">
            <label for="filterResidentSex" class="form-label">性别:</label>
            <select class="form-select" id="filterResidentSex" v-model="filters.residentSex">
              <option value="">全部</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary align-self-end" style="width: 100px" @click="applyResidentFilters">查询</button>
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>用户名</th>
            <th>姓名</th>
            <th>性别</th>
            <th>出生日期</th>
            <th>地址</th>
            <th>身份证号</th>
            <th>邮箱</th>
            <th>电话</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resident in filteredResidents" :key="resident.Account">
            <td>{{ resident.Account }}</td>
            <td>{{ resident.Name }}</td>
            <td>{{ resident.Sex }}</td>
            <td>{{ resident.DateOfBirthday }}</td>
            <td>{{ resident.Address }}</td>
            <td>{{ resident.IDNumber }}</td>
            <td>{{ resident.Email }}</td>
            <td>{{ resident.PhoneNumber }}</td>
            <td>
              <button class="btn btn-link" @click="openResidentModal(resident)">修改</button>
              <button class="btn btn-link text-danger" @click="deleteResident(resident)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 管理城市管理者界面 -->
    <div v-if="activeTab === 'cityManagers'">
      <div class="d-flex justify-content-between mb-4">
        <button class="btn btn-success mb-3" @click="openCityManagerModal(null)">新建城市管理者</button>
        <div class="d-flex">
          <div class="me-3">
            <label for="filterManagerName" class="form-label">姓名:</label>
            <input type="text" class="form-control" id="filterManagerName" v-model="filters.managerName" placeholder="请输入姓名">
          </div>
          <div class="me-3">
            <label for="filterManagerDepartment" class="form-label">部门:</label>
            <select class="form-select" id="filterManagerDepartment" v-model="filters.managerDepartment">
              <option value="">全部</option>
              <option value="部门1">部门1</option>
              <option value="部门2">部门2</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary align-self-end" style="width: 100px" @click="applyManagerFilters">查询</button>
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>用户名</th>
            <th>姓名</th>
            <th>性别</th>
            <th>邮箱</th>
            <th>电话</th>
            <th>地址</th>
            <th>身份证号</th>
            <th>部门</th>
            <th>职位</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="manager in filteredCityManagers" :key="manager.Account">
            <td>{{ manager.Account }}</td>
            <td>{{ manager.Name }}</td>
            <td>{{ manager.Sex }}</td>
            <td>{{ manager.Email }}</td>
            <td>{{ manager.PhoneNumber }}</td>
            <td>{{ manager.Address }}</td>
            <td>{{ manager.IDNumber }}</td>
            <td>{{ manager.Department }}</td>
            <td>{{ manager.Position }}</td>
            <td>
              <button class="btn btn-link" @click="openCityManagerModal(manager)">修改</button>
              <button class="btn btn-link text-danger" @click="deleteCityManager(manager)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 系统总管界面 -->
    <div v-if="activeTab === 'admin'">
      <div class="d-flex justify-content-between mb-4">
        <button class="btn btn-success mb-3" @click="openAdminModal(null)">新建系统总管</button>
        <div class="d-flex">
          <div class="me-3">
            <label for="filterAdminName" class="form-label">姓名:</label>
            <input type="text" class="form-control" id="filterAdminName" v-model="filters.adminName" placeholder="请输入姓名">
          </div>
          <div class="me-3">
            <label for="filterAdminPosition" class="form-label">职位:</label>
            <select class="form-select" id="filterAdminPosition" v-model="filters.adminPosition">
              <option value="">全部</option>
              <option value="系统管理员">系统管理员</option>
              <option value="系统总监">系统总监</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary align-self-end" style="width: 100px" @click="applyAdminFilters">查询</button>
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>用户名</th>
            <th>姓名</th>
            <th>职位</th>
            <th>备注</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in filteredAdmins" :key="admin.Account">
            <td>{{ admin.Account }}</td>
            <td>{{ admin.Name }}</td>
            <td>{{ admin.Position }}</td>
            <td>{{ admin.Remark }}</td>
            <td>
              <button class="btn btn-link" @click="openAdminModal(admin)">修改</button>
              <button class="btn btn-link text-danger" @click="deleteAdmin(admin)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 添加与修改用户模态框 -->
    <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="userModalLabel">{{ isEdit ? '修改' : '新建' }}{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="activeTab === 'residents'">
              <form @submit.prevent="saveResident">
                <div class="mb-3">
                  <label for="residentAccount" class="form-label">用户名:</label>
                  <input type="text" class="form-control" id="residentAccount" v-model="currentUser.Account" required>
                </div>
                <div class="mb-3">
                  <label for="residentName" class="form-label">姓名:</label>
                  <input type="text" class="form-control" id="residentName" v-model="currentUser.Name" required>
                </div>
                <div class="mb-3">
                  <label for="residentSex" class="form-label">性别:</label>
                  <select class="form-select" id="residentSex" v-model="currentUser.Sex" required>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="residentDOB" class="form-label">出生日期:</label>
                  <input type="date" class="form-control" id="residentDOB" v-model="currentUser.DateOfBirthday" required>
                </div>
                <div class="mb-3">
                  <label for="residentAddress" class="form-label">地址:</label>
                  <input type="text" class="form-control" id="residentAddress" v-model="currentUser.Address" required>
                </div>
                <div class="mb-3">
                  <label for="residentIDNumber" class="form-label">身份证号:</label>
                  <input type="text" class="form-control" id="residentIDNumber" v-model="currentUser.IDNumber" required>
                </div>
                <div class="mb-3">
                  <label for="residentEmail" class="form-label">邮箱:</label>
                  <input type="email" class="form-control" id="residentEmail" v-model="currentUser.Email" required>
                </div>
                <div class="mb-3">
                  <label for="residentPhoneNumber" class="form-label">电话:</label>
                  <input type="text" class="form-control" id="residentPhoneNumber" v-model="currentUser.PhoneNumber" required>
                </div>
                <button type="submit" class="btn btn-primary">{{ isEdit ? '保存修改' : '创建' }}</button>
              </form>
            </div>

            <div v-if="activeTab === 'cityManagers'">
              <form @submit.prevent="saveCityManager">
                <div class="mb-3">
                  <label for="managerAccount" class="form-label">用户名:</label>
                  <input type="text" class="form-control" id="managerAccount" v-model="currentUser.Account" required>
                </div>
                <div class="mb-3">
                  <label for="managerName" class="form-label">姓名:</label>
                  <input type="text" class="form-control" id="managerName" v-model="currentUser.Name" required>
                </div>
                <div class="mb-3">
                  <label for="managerSex" class="form-label">性别:</label>
                  <select class="form-select" id="managerSex" v-model="currentUser.Sex" required>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="managerEmail" class="form-label">邮箱:</label>
                  <input type="email" class="form-control" id="managerEmail" v-model="currentUser.Email" required>
                </div>
                <div class="mb-3">
                  <label for="managerPhoneNumber" class="form-label">电话:</label>
                  <input type="text" class="form-control" id="managerPhoneNumber" v-model="currentUser.PhoneNumber" required>
                </div>
                <div class="mb-3">
                  <label for="managerAddress" class="form-label">地址:</label>
                  <input type="text" class="form-control" id="managerAddress" v-model="currentUser.Address" required>
                </div>
                <div class="mb-3">
                  <label for="managerIDNumber" class="form-label">身份证号:</label>
                  <input type="text" class="form-control" id="managerIDNumber" v-model="currentUser.IDNumber" required>
                </div>
                <div class="mb-3">
                  <label for="managerDepartment" class="form-label">部门:</label>
                  <input type="text" class="form-control" id="managerDepartment" v-model="currentUser.Department" required>
                </div>
                <div class="mb-3">
                  <label for="managerPosition" class="form-label">职位:</label>
                  <input type="text" class="form-control" id="managerPosition" v-model="currentUser.Position" required>
                </div>
                <button type="submit" class="btn btn-primary">{{ isEdit ? '保存修改' : '创建' }}</button>
              </form>
            </div>

            <div v-if="activeTab === 'admin'">
              <form @submit.prevent="saveAdmin">
                <div class="mb-3">
                  <label for="adminAccount" class="form-label">用户名:</label>
                  <input type="text" class="form-control" id="adminAccount" v-model="currentUser.Account" required>
                </div>
                <div class="mb-3">
                  <label for="adminName" class="form-label">姓名:</label>
                  <input type="text" class="form-control" id="adminName" v-model="currentUser.Name" required>
                </div>
                <div class="mb-3">
                  <label for="adminPosition" class="form-label">职位:</label>
                  <input type="text" class="form-control" id="adminPosition" v-model="currentUser.Position" required>
                </div>
                <div class="mb-3">
                  <label for="adminRemark" class="form-label">备注:</label>
                  <input type="text" class="form-control" id="adminRemark" v-model="currentUser.Remark">
                </div>
                <button type="submit" class="btn btn-primary">{{ isEdit ? '保存修改' : '创建' }}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      activeTab: 'residents', // 当前选中的选项卡
      filters: {
        residentName: '',
        residentSex: '',
        managerName: '',
        managerDepartment: '',
        adminName: '',
        adminPosition: ''
      },
      residents: [],
      cityManagers: [],
      admins: [],
      filteredResidents: [],
      filteredCityManagers: [],
      filteredAdmins: [],
      isEdit: false,
      modalTitle: '',
      currentUser: {}
    };
  },
  watch: {
    filters: {
      handler() {
        this.applyFilters();
      },
      deep: true
    }
  },
  mounted() {
    // 初始化数据
    this.fetchResidents();
    this.fetchCityManagers();
    this.fetchAdmins();
  },
  methods: {
    applyFilters() {
      this.filteredResidents = this.residents.filter(resident => {
        return (
          (!this.filters.residentName || resident.Name.includes(this.filters.residentName)) &&
          (!this.filters.residentSex || resident.Sex === this.filters.residentSex)
        );
      });

      this.filteredCityManagers = this.cityManagers.filter(manager => {
        return (
          (!this.filters.managerName || manager.Name.includes(this.filters.managerName)) &&
          (!this.filters.managerDepartment || manager.Department === this.filters.managerDepartment)
        );
      });

      this.filteredAdmins = this.admins.filter(admin => {
        return (
          (!this.filters.adminName || admin.Name.includes(this.filters.adminName)) &&
          (!this.filters.adminPosition || admin.Position === this.filters.adminPosition)
        );
      });
    },
    openResidentModal(resident) {
      this.isEdit = !!resident;
      this.modalTitle = '市民';
      this.currentUser = resident ? { ...resident } : {};
      new bootstrap.Modal(document.getElementById('userModal')).show();
    },
    openCityManagerModal(manager) {
      this.isEdit = !!manager;
      this.modalTitle = '城市管理者';
      this.currentUser = manager ? { ...manager } : {};
      new bootstrap.Modal(document.getElementById('userModal')).show();
    },
    openAdminModal(admin) {
      this.isEdit = !!admin;
      this.modalTitle = '系统总管';
      this.currentUser = admin ? { ...admin } : {};
      new bootstrap.Modal(document.getElementById('userModal')).show();
    },
    saveResident() {
      if (this.isEdit) {
        const index = this.residents.findIndex(r => r.Account === this.currentUser.Account);
        this.$set(this.residents, index, this.currentUser);
      } else {
        this.residents.push(this.currentUser);
      }
      this.applyFilters();
      bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
    },
    saveCityManager() {
      if (this.isEdit) {
        const index = this.cityManagers.findIndex(m => m.Account === this.currentUser.Account);
        this.$set(this.cityManagers, index, this.currentUser);
      } else {
        this.cityManagers.push(this.currentUser);
      }
      this.applyFilters();
      bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
    },
    saveAdmin() {
      if (this.isEdit) {
        const index = this.admins.findIndex(a => a.Account === this.currentUser.Account);
        this.$set(this.admins, index, this.currentUser);
      } else {
        this.admins.push(this.currentUser);
      }
      this.applyFilters();
      bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
    },
    deleteResident(resident) {
      this.residents = this.residents.filter(r => r.Account !== resident.Account);
      this.applyFilters();
    },
    deleteCityManager(manager) {
      this.cityManagers = this.cityManagers.filter(m => m.Account !== manager.Account);
      this.applyFilters();
    },
    deleteAdmin(admin) {
      this.admins = this.admins.filter(a => a.Account !== admin.Account);
      this.applyFilters();
    },
    fetchResidents() {
      // 获取市民数据
      this.residents = [
        {
          Account: 'user1',
          Name: '张三',
          Sex: '男',
          DateOfBirthday: '1990-01-01',
          Address: '北京市',
          IDNumber: '110101199001011234',
          Email: 'zhangsan@example.com',
          PhoneNumber: '13800138000'
        },
        // 其他市民数据
      ];
      this.filteredResidents = this.residents;
    },
    fetchCityManagers() {
      // 获取城市管理者数据
      this.cityManagers = [
        {
          Account: 'manager1',
          Name: '李四',
          Sex: '女',
          Email: 'lisi@example.com',
          PhoneNumber: '13800138001',
          Address: '北京市',
          IDNumber: '110101199002021234',
          Department: '部门1',
          Position: '职位1'
        },
        // 其他城市管理者数据
      ];
      this.filteredCityManagers = this.cityManagers;
    },
    fetchAdmins() {
      // 获取系统总管数据
      this.admins = [
        {
          Account: 'admin1',
          Name: '王五',
          Position: '系统管理员',
          Remark: '系统总管'
        },
        // 其他系统总管数据
      ];
      this.filteredAdmins = this.admins;
    }
  }
};
</script>

<style scoped>
.nav-tabs .nav-link.active {
  background-color: #e9ecef;
  border-color: #dee2e6 #dee2e6 #fff;
}
.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.075);
}
</style>
