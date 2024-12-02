package com.webNoter.Repository;

import com.webNoter.Controllers.SubFolder;
import com.webNoter.Entity.SubFolders;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubFolderRepository extends MongoRepository<SubFolders, String> {

    boolean existsBySubFolderNameAndProjectId(String subFolderName, String projectId);

    List<SubFolders> findByprojectId(String id);

    Optional<SubFolders> findById(String id);
}