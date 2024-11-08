package com.webNoter.Repository;

import com.webNoter.Entity.User;
import org.springframework.data.mongodb.core.annotation.Collation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends MongoRepository<User , String> {
    Optional<User> findByEmail(String email);

    @Query(value = "{ 'field': ?0 }")
    @Collation("en") // Set locale for sorting and comparison
    List<User> findByField(String field);




}
