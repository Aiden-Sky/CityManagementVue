<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between mb-4">
      <div class="d-flex">
        <div class="me-3">
          <label for="filterOrganization" class="form-label">机构:</label>
          <select class="form-select" id="filterOrganization" v-model="filters.organization">
            <option value="">全部</option>
            <option value="机构1">机构1</option>
            <option value="机构2">机构2</option>
          </select>
        </div>
        <div class="me-3">
          <label for="filterUsername" class="form-label">用户名:</label>
          <input type="text" class="form-control" id="filterUsername" v-model="filters.username" placeholder="请输入用户名">
        </div>
        <div class="me-3">
          <label for="filterStatus" class="form-label">状态:</label>
          <select class="form-select" id="filterStatus" v-model="filters.status">
            <option value="">全部</option>
            <option value="正常">正常</option>
            <option value="禁用">禁用</option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary align-self-end" style="width: 100px" @click="applyFilters">查询</button>
    </div>
    <button class="btn btn-success mb-3" style="float: left" @click="createUser">新建用户</button>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>一级机构</th>
          <th>二级机构</th>
          <th>用户类型</th>
          <th>用户名</th>
          <th>密码</th>
          <th>联系人姓名</th>
          <th>联系方式</th>
          <th>邮箱</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.account">
          <td>{{ user.organization1 }}</td>
          <td>{{ user.organization2 }}</td>
          <td>{{ user.userType }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.password }}</td>
          <td>{{ user.contactName }}</td>
          <td>{{ user.contactPhone }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.status }}</td>
          <td>
            <button class="btn btn-link" @click="editUser(user)">修改</button>
            <button class="btn btn-link text-danger" @click="deleteUser(user)">删除</button>
            <button class="btn btn-link text-warning" @click="toggleUserStatus(user)">
              {{ user.status === '正常' ? '禁用' : '启用' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      filters: {
        organization: '',
        username: '',
        status: ''
      },
      users: [
        // 示例用户数据
        {
          account: 'user1',
          organization1: '南方慧通',
          organization2: '资讯部',
          userType: '接口用户',
          username: 'csn_admin',
          password: '******',
          contactName: '张三',
          contactPhone: '18899998888',
          email: 'xlong.ji@yeclub.com',
          status: '正常'
        },
        {
          account: 'user2',
          organization1: '南方慧通',
          organization2: '资讯部',
          userType: '系统用户',
          username: 'admin',
          password: '*******',
          contactName: '张三',
          contactPhone: '18899998888',
          email: 'xlong.ji@yeclub.com',
          status: '正常'
        }
      ],
      filteredUsers: []
    };
  },
  mounted() {
    this.applyFilters();
  },
  methods: {
    applyFilters() {
      this.filteredUsers = this.users.filter(user => {
        return (
          (!this.filters.organization || user.organization1.includes(this.filters.organization)) &&
          (!this.filters.username || user.username.includes(this.filters.username)) &&
          (!this.filters.status || user.status === this.filters.status)
        );
      });
    },
    createUser() {
      // 新建用户逻辑
      console.log('新建用户');
    },

    editUser(user) {
      // 修改用户逻辑
      console.log('修改用户:', user);
    },
    deleteUser(user) {
      // 删除用户逻辑
      console.log('删除用户:', user);
      this.users = this.users.filter(u => u.account !== user.account);
      this.applyFilters();
    },
    toggleUserStatus(user) {
      // 切换用户状态逻辑
      user.status = user.status === '正常' ? '禁用' : '正常';
      this.applyFilters();
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.table-hover tbody tr:hover {
  background-color: #f5f5f5;
}
.btn-link {
  padding: 0;
  font-size: 0.875rem;
}
</style>
