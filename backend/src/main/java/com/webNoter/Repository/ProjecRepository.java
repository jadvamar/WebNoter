package com.webNoter.Repository;

import com.webNoter.Entity.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjecRepository extends MongoRepository<Project,String> {

    List<Project> findAllById(Iterable<String> ids);
    boolean existsByProjectName(String name);
    Optional<Project> findById(String id);
    Optional<Project> findByProjectName(String name);
}
