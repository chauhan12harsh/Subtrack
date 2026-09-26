package com.subtrack.entity;
import jakarta.persistence.*; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="Notification")
public class Notification {
@Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
@Column(name="user_id",nullable=false) private UUID userId;
private String title; @Column(length=2000) private String message;
@Enumerated(EnumType.STRING) private NotificationType type=NotificationType.General;
private boolean isRead=false; private Instant createdAt=Instant.now();
protected Notification(){}
public Notification(UUID userId,String title,String message,NotificationType type){this.userId=userId;this.title=title;this.message=message;this.type=type==null?NotificationType.General:type;}
public UUID getId(){return id;} public UUID getUserId(){return userId;} public String getTitle(){return title;} public String getMessage(){return message;} public NotificationType getType(){return type;} public boolean isRead(){return isRead;} public Instant getCreatedAt(){return createdAt;} public void markRead(){isRead=true;}
}