namespace BankCustomerAPI.Entities.DTO
{
    public class LoginResponse
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public List<UserRoleInfo> UserRoles { get; set; } = new List<UserRoleInfo>();
    }

    public class UserRoleInfo
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
    }
}
