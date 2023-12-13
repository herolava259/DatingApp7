using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoginDto = API.DTOs.LoginDto;
using UserDto = API.DTOs.UserDto;
namespace API.Controllers
{
    public class AccountController: BaseApiController
    {
        private readonly DataContext _dbContext ;

        private readonly ITokenService _tokenService;

        public AccountController(DataContext context, ITokenService tokenService)
        {
            _dbContext = context;

            _tokenService = tokenService;
        }

        [HttpPost("register")] // POST request api/account/register
        public async Task<ActionResult<UserDto>> Register([FromBody]RegisterDto registerDto)
        {
            if((await UserExists(registerDto.UserName)))
            {
                return BadRequest("Username is taken");
            }
            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                UserName = registerDto.UserName.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };
            _dbContext.Users.Add(user);

            await _dbContext.SaveChangesAsync();


            return new UserDto{
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody]LoginDto loginDto)
        {
            var user = await _dbContext.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

            if(user == null) return Unauthorized("invalid username");


            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for(int i = 0; i < computeHash.Length; i++)
            {
                if(computeHash[i] != user.PasswordHash[i]) return Unauthorized("invalid password");

            }

            return new UserDto{
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            };
        }
        private async Task<bool> UserExists(string username)
        {
            return await _dbContext.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}