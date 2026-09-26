package com.subtrack.controller;
import com.subtrack.dto.AuthDtos; import com.subtrack.entity.*; import com.subtrack.repository.UserRepository; import com.subtrack.security.JwtService; import jakarta.validation.Valid; import org.springframework.http.HttpStatus; import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; import org.springframework.web.bind.annotation.*; import org.springframework.web.server.ResponseStatusException;
@RestController @RequestMapping("/auth")
public class AuthController {
private final UserRepository users; private final JwtService jwt; private final BCryptPasswordEncoder encoder=new BCryptPasswordEncoder();
public AuthController(UserRepository users,JwtService jwt){this.users=users;this.jwt=jwt;}
@PostMapping("/register") public AuthDtos.UserView register(@Valid @RequestBody AuthDtos.Register r){if(users.existsByEmailIgnoreCase(r.email())||users.existsByUsernameIgnoreCase(r.username()))throw new ResponseStatusException(HttpStatus.CONFLICT,"Email or username already exists");User u=new User(r.username(),r.email(),encoder.encode(r.password()));users.save(u);return view(u);}
@PostMapping("/login") public AuthDtos.Token login(@Valid @RequestBody AuthDtos.Login r){User u=users.findByEmailIgnoreCaseOrUsernameIgnoreCase(r.emailOrUsername(),r.emailOrUsername()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid credentials"));if(!encoder.matches(r.password(),u.getPasswordHash()))throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid credentials");return new AuthDtos.Token(jwt.create(u.getId().toString(),u.getRole().name()));}
private AuthDtos.UserView view(User u){return new AuthDtos.UserView(u.getId(),u.getUsername(),u.getEmail(),u.getBalance(),u.getRole().name());}
}