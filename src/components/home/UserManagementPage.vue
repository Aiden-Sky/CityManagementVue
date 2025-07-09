 <template>
  <div class="container mt-5">
    <!-- 切换用户类型的选项卡 -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'residents' }" @click="activeTab = 'residents'">管理市民</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'cityManagers' }" @click="activeTab = 'cityManagers'">执法人员</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'admins' }" @click="activeTab = 'admins'">系统总管</a>
      </li>
    </ul>

    <!-- 管理市民界面 -->
    <div v-if="activeTab === 'residents'">
      <div class="d-flex justify-content-between mb-4">
        <button class="btn btn-success mb-3" @click="openModal(null, 'residents')">新建市民</button>
        <div class="d-flex">
          <div class="me-3">
            <label for="filterResidentName" class="form-label">姓名:</label>
            <input type="text" class="form-control" id="filterResidentName" v-model="filters.residentName" placeholder="请输入姓名">
          </div>
          <div class="me-3">
            <label for="filterResidentSex" class="form-label">性别:</label>
            <select class="form-select" id="filterResidentSex" v-model="filters.residentSex">
              <option value="">全部</option>
              <option value="1">男</option>
              <option value="0">女</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary align-self-end" style="width: 100px" @click="applyFilters('residents')">查询</button>
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
            <th>是否激活</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resident in filteredResidents" :key="resident.ResidentID">
            <td>{{ resident.Account }}</td>
            <td>{{ resident.Name }}</td>
            <td>{{ resident.Sex ? '男' : '女' }}</td>
            <td>{{ resident.DateOfBirthday }}</td>
            <td>{{ resident.Address }}</td>
            <td>{{ resident.IDNumber }}</td>
            <td>{{ resident.Email }}</td>
            <td>{{ resident.PhoneNumber }}</td>
            <td>{{ resident.IsActive ? '是' : '否' }}</td>
            <td>
              <button class="btn btn-link" @click="openModal(resident, 'residents')">修改</button>
              <button class="btn btn-link text-danger" @click="deleteUser(resident, 'residents')">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 管理城市管理者界面 -->
    <div v-if="activeTab === 'cityManagers'">
      <div class="d-flex justify-content-between mb-4">
        <button class="btn btn-success mb-3" @click="openModal(null, 'cityManagers')">新建城市管理者</button>
        <div class="d-flex">
          <div class="me-3">
            <label for="filterManagerName" class="form-label">姓名:</label>
            <input type="text" class="form-control" id="filterManagerName" v-model="filters.managerName" placeholder="请输入姓名">
          </div>
          <div class="me-3">
            <label for="filterManagerDepartment" class="form-label">部门:</label>
            <input type="text" class="form-control" id="filterManagerDepartment" v-model="filters.managerDepartment" placeholder="请输入部门">
          </div>
        </div>
        <button class="btn btn-primary align-self-end" style="width: 100px" @click="applyFilters('cityManagers')">查询</button>
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
            <th>是否激活</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="manager in filteredCityManagers" :key="manager.ManageID">
            <td>{{ manager.Account }}</td>
            <td>{{ manager.Name }}</td>
            <td>{{ manager.Sex ? '男' : '女' }}</td>
            <td>{{ manager.Email }}</td>
            <td>{{ manager.PhoneNumber }}</td>
            <td>{{ manager.Address }}</td>
            <td>{{ manager.IDNumber }}</td>
            <td>{{ manager.Department }}</td>
            <td>{{ manager.Position }}</td>
            <td>{{ manager.IsActive ? '是' : '否' }}</td>
            <td>
              <button class="btn btn-link" @click="openModal(manager, 'cityManagers')">修改</button>
              <button class="btn btn-link text-danger" @click="deleteUser(manager, 'cityManagers')">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 系统总管界面 -->
    <div v-if="activeTab === 'admins'">
      <div class="d-flex justify-content-between mb-4">
        <button class="btn btn-success mb-3" @click="openModal(null, 'admins')">新建系统总管</button>
        <div class="d-flex">
          <div class="me-3">
            <label for="filterAdminName" class="form-label">姓名:</label>
            <input type="text" class="form-control" id="filterAdminName" v-model="filters.adminName" placeholder="请输入姓名">
          </div>
          <div class="me-3">
            <label for="filterAdminPosition" class="form-label">职位:</label>
            <input type="text" class="form-control" id="filterAdminPosition" v-model="filters.adminPosition" placeholder="请输入职位">
          </div>
        </div>
        <button class="btn btn-primary align-self-end" style="width: 100px" @click="applyFilters('admins')">查询</button>
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>用户名</th>
            <th>姓名</th>
            <th>性别</th>
            <th>职位</th>
            <th>备注</th>
            <th>是否激活</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in filteredAdmins" :key="admin.AdminID">
            <td>{{ admin.Account }}</td>
            <td>{{ admin.Name }}</td>
            <td>{{ admin.Sex ? '男' : '女' }}</td>
            <td>{{ admin.Position }}</td>
            <td>{{ admin.Remark }}</td>
            <td>{{ admin.IsActive ? '是' : '否' }}</td>
            <td>
              <button class="btn btn-link" @click="openModal(admin, 'admins')">修改</button>
              <button class="btn btn-link text-danger" @click="deleteUser(admin, 'admins')">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 添加与修改用户模态框 -->
    <div v-if="showModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? '修改' : '新建' }}{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label for="account" class="form-label">用户名:</label>
                <input type="text" class="form-control" id="account" v-model="userForm.Account" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">密码:</label>
                <input type="password" class="form-control" id="password" v-model="userForm.PasswordHash" required>
              </div>
              <div class="mb-3">
                <label for="name" class="form-label">姓名:</label>
                <input type="text" class="form-control" id="name" v-model="userForm.Name" required>
              </div>
              <div class="mb-3">
                <label for="sex" class="form-label">性别:</label>
                <select class="form-select" id="sex" v-model="userForm.Sex" required>
                  <option value="1">男</option>
                  <option value="0">女</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">邮箱:</label>
                <input type="email" class="form-control" id="email" v-model="userForm.Email" required>
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label">电话:</label>
                <input type="tel" class="form-control" id="phone" v-model="userForm.PhoneNumber" required>
              </div>
              <div class="mb-3">
                <label for="address" class="form-label">地址:</label>
                <input type="text" class="form-control" id="address" v-model="userForm.Address" required>
              </div>
              <div class="mb-3">
                <label for="idNumber" class="form-label">身份证号:</label>
                <input type="text" class="form-control" id="idNumber" v-model="userForm.IDNumber" required>
              </div>
              <div class="mb-3">
                <label for="isActive" class="form-label">是否激活:</label>
                <select class="form-select" id="isActive" v-model="userForm.IsActive" required>
                  <option value="true">是</option>
                  <option value="false">否</option>
                </select>
              </div>
              <!-- 特定类型用户的额外字段 -->
              <template v-if="activeTab === 'cityManagers'">
                <div class="mb-3">
                  <label for="department" class="form-label">部门:</label>
                  <input type="text" class="form-control" id="department" v-model="userForm.Department" required>
                </div>
                <div class="mb-3">
                  <label for="position" class="form-label">职位:</label>
                  <input type="text" class="form-control" id="position" v-model="userForm.Position" required>
                </div>
              </template>
              <template v-if="activeTab === 'admins'">
                <div class="mb-3">
                  <label for="position" class="form-label">职位:</label>
                  <input type="text" class="form-control" id="position" v-model="userForm.Position" required>
                </div>
                <div class="mb-3">
                  <label for="remark" class="form-label">备注:</label>
                  <textarea class="form-control" id="remark" v-model="userForm.Remark" rows="3"></textarea>
                </div>
              </template>
              <button type="submit" class="btn btn-primary">保存</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'residents', // 当前激活的选项卡
      showModal: false, // 控制模态框显示
      isEdit: false, // 判断是新增还是编辑
      modalTitle: '', // 模态框标题
      userForm: {}, // 当前表单数据
      filters: {
        // 各种过滤条件
        residentName: '',
        residentSex: '',
        managerName: '',
        managerDepartment: '',
        adminName: '',
        adminPosition: '',
      },
      // 假数据，用于展示
      residents: [
        {
          ResidentID: 1,
          Account: 'resident1',
          PasswordHash: 'password1',
          Name: '李四',
          Sex: 1,
          DateOfBirthday: '1990-01-01',
          Address: '北京市海淀区',
          IDNumber: '123456789012345678',
          Email: 'resident1@example.com',
          PhoneNumber: '1234567890',
          IsActive: true,
        },
        {
          ResidentID: 2,
          Account: 'resident2',
          PasswordHash: 'password2',
          Name: '张三',
          Sex: 1,
          DateOfBirthday: '1985-02-15',
          Address: '上海市浦东新区',
          IDNumber: '234567890123456789',
          Email: 'resident2@example.com',
          PhoneNumber: '1234567891',
          IsActive: true,
        },
        {
          ResidentID: 3,
          Account: 'resident3',
          PasswordHash: 'password3',
          Name: '王五',
          Sex: 1,
          DateOfBirthday: '1978-03-22',
          Address: '广州市天河区',
          IDNumber: '345678901234567890',
          Email: 'resident3@example.com',
          PhoneNumber: '1234567892',
          IsActive: true,
        },
        {
          ResidentID: 4,
          Account: 'resident4',
          PasswordHash: 'password4',
          Name: '赵六',
          Sex: 0,
          DateOfBirthday: '1995-04-18',
          Address: '深圳市南山区',
          IDNumber: '456789012345678901',
          Email: 'resident4@example.com',
          PhoneNumber: '1234567893',
          IsActive: true,
        },
        {
          ResidentID: 5,
          Account: 'resident5',
          PasswordHash: 'password5',
          Name: '孙七',
          Sex: 0,
          DateOfBirthday: '1982-05-30',
          Address: '成都市武侯区',
          IDNumber: '567890123456789012',
          Email: 'resident5@example.com',
          PhoneNumber: '1234567894',
          IsActive: true,
        }
      ],
      cityManagers: [
        {
          ManageID: 1,
          Account: 'manager1',
          PasswordHash: 'password1',
          Name: '王五',
          Sex: 0,
          Email: 'manager1@example.com',
          PhoneNumber: '0987654321',
          Address: '杭州市西湖区',
          IDNumber: '987654321098765432',
          Department: '城管部门',
          Position: '队长',
          IsActive: true,
        },
        {
          ManageID: 2,
          Account: 'manager2',
          PasswordHash: 'password2',
          Name: '李雷',
          Sex: 1,
          Email: 'manager2@example.com',
          PhoneNumber: '0987654322',
          Address: '南京市鼓楼区',
          IDNumber: '876543210987654321',
          Department: '城管部门',
          Position: '副队长',
          IsActive: true,
        },
        {
          ManageID: 3,
          Account: 'manager3',
          PasswordHash: 'password3',
          Name: '赵强',
          Sex: 1,
          Email: 'manager3@example.com',
          PhoneNumber: '0987654323',
          Address: '重庆市渝中区',
          IDNumber: '765432109876543210',
          Department: '交通管理',
          Position: '主管',
          IsActive: true,
        },
        {
          ManageID: 4,
          Account: 'manager4',
          PasswordHash: 'password4',
          Name: '陈刚',
          Sex: 0,
          Email: 'manager4@example.com',
          PhoneNumber: '0987654324',
          Address: '天津市南开区',
          IDNumber: '654321098765432109',
          Department: '环境保护',
          Position: '组长',
          IsActive: true,
        },
        {
          ManageID: 5,
          Account: 'manager5',
          PasswordHash: 'password5',
          Name: '周杰',
          Sex: 1,
          Email: 'manager5@example.com',
          PhoneNumber: '0987654325',
          Address: '沈阳市和平区',
          IDNumber: '543210987654321098',
          Department: '市政工程',
          Position: '工程师',
          IsActive: true,
        }
      ],
      admins: [
        {
          AdminID: 1,
          Account: 'admin1',
          PasswordHash: 'password1',
          Name: '赵六',
          Sex: 1,
          Position: '总管',
          Remark: '负责系统管理',
          IsActive: true,
        },
        {
          AdminID: 2,
          Account: 'admin2',
          PasswordHash: 'password2',
          Name: '钱七',
          Sex: 0,
          Position: '副总管',
          Remark: '负责系统维护',
          IsActive: true,
        },
        {
          AdminID: 3,
          Account: 'admin3',
          PasswordHash: 'password3',
          Name: '孙八',
          Sex: 1,
          Position: '网络管理员',
          Remark: '负责网络安全',
          IsActive: true,
        },
        {
          AdminID: 4,
          Account: 'admin4',
          PasswordHash: 'password4',
          Name: '周九',
          Sex: 0,
          Position: '数据库管理员',
          Remark: '负责数据库管理',
          IsActive: true,
        },
        {
          AdminID: 5,
          Account: 'admin5',
          PasswordHash: 'password5',
          Name: '郑十',
          Sex: 1,
          Position: '安全管理员',
          Remark: '负责系统安全',
          IsActive: true,
        }
      ],
    };
  },
  computed: {
    filteredResidents() {
      return this.residents.filter((resident) => {
        return (
          (this.filters.residentName === '' || resident.Name.includes(this.filters.residentName)) &&
          (this.filters.residentSex === '' || resident.Sex.toString() === this.filters.residentSex)
        );
      });
    },
    filteredCityManagers() {
      return this.cityManagers.filter((manager) => {
        return (
          (this.filters.managerName === '' || manager.Name.includes(this.filters.managerName)) &&
          (this.filters.managerDepartment === '' || manager.Department.includes(this.filters.managerDepartment))
        );
      });
    },
    filteredAdmins() {
      return this.admins.filter((admin) => {
        return (
          (this.filters.adminName === '' || admin.Name.includes(this.filters.adminName)) &&
          (this.filters.adminPosition === '' || admin.Position.includes(this.filters.adminPosition))
        );
      });
    },
  },
  methods: {
    openModal(user, tab) {
      this.showModal = true;
      this.isEdit = !!user;
      this.modalTitle = tab === 'residents' ? '市民' : tab === 'cityManagers' ? '城市管理者' : '系统总管';
      if (user) {
        // 编辑用户
        this.userForm = { ...user };
      } else {
        // 新增用户
        this.userForm = {
          Account: '',
          PasswordHash: '',
          Name: '',
          Sex: '1',
          Email: '',
          PhoneNumber: '',
          Address: '',
          IDNumber: '',
          IsActive: true,
          Department: '',
          Position: '',
          Remark: '',
        };
      }
    },
    closeModal() {
      this.showModal = false;
    },
    saveUser() {
      if (this.isEdit) {
        // 更新用户
        const index = this.getUserIndexById(this.userForm, this.activeTab);
        if (index !== -1) {
          this.updateUserData(index, this.activeTab);
        }
      } else {
        // 新增用户
        this.addUserData(this.activeTab);
      }
      this.closeModal();
    },
    getUserIndexById(user, tab) {
      let usersArray = [];
      if (tab === 'residents') {
        usersArray = this.residents;
      } else if (tab === 'cityManagers') {
        usersArray = this.cityManagers;
      } else {
        usersArray = this.admins;
      }
      return usersArray.findIndex((u) => u.Account === user.Account);
    },
    updateUserData(index, tab) {
      if (tab === 'residents') {
        this.residents.splice(index, 1, this.userForm);
      } else if (tab === 'cityManagers') {
        this.cityManagers.splice(index, 1, this.userForm);
      } else {
        this.admins.splice(index, 1, this.userForm);
      }
    },
    addUserData(tab) {
      if (tab === 'residents') {
        this.residents.push({ ...this.userForm, ResidentID: this.residents.length + 1 });
      } else if (tab === 'cityManagers') {
        this.cityManagers.push({ ...this.userForm, ManageID: this.cityManagers.length + 1 });
      } else {
        this.admins.push({ ...this.userForm, AdminID: this.admins.length + 1 });
      }
    },
    deleteUser(user, tab) {
      const index = this.getUserIndexById(user, tab);
      if (index !== -1) {
        if (tab === 'residents') {
          this.residents.splice(index, 1);
        } else if (tab === 'cityManagers') {
          this.cityManagers.splice(index, 1);
        } else {
          this.admins.splice(index, 1);
        }
      }
    },
  },
};
</script>

<style scoped>
.modal-dialog {
  max-width: 800px;
}
</style>
