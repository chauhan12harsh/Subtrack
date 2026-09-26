package com.subtrack.entity;
import jakarta.persistence.*; import java.math.BigDecimal; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="Subscription")
public class Subscription {
@Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
@Column(name="user_id",nullable=false) private UUID userId;
@Column(nullable=false) private String name;
@Column(nullable=false,precision=19,scale=2) private BigDecimal amount;
private String category="Other";
@Enumerated(EnumType.STRING) private BillingStatus status=BillingStatus.Active;
@Enumerated(EnumType.STRING) private BillingCycle billingCycle;
private Instant nextBillingDate;
protected Subscription(){}
public Subscription(UUID userId,String name,BigDecimal amount,String category,BillingCycle cycle,Instant next){this.userId=userId;this.name=name;this.amount=amount;this.category=category==null?"Other":category;this.billingCycle=cycle;this.nextBillingDate=next;this.status=BillingStatus.Active;}
public UUID getId(){return id;} public UUID getUserId(){return userId;} public String getName(){return name;} public BigDecimal getAmount(){return amount;} public String getCategory(){return category;} public BillingStatus getStatus(){return status;} public BillingCycle getBillingCycle(){return billingCycle;} public Instant getNextBillingDate(){return nextBillingDate;}
public void update(String name,BigDecimal amount,String category,BillingCycle cycle,Instant next){if(name!=null)this.name=name;if(amount!=null)this.amount=amount;if(category!=null)this.category=category;if(cycle!=null)this.billingCycle=cycle;if(next!=null)this.nextBillingDate=next;}
public void setStatus(BillingStatus status){this.status=status;}
}