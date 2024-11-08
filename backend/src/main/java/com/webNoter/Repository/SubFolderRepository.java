package com.webNoter.Repository;

import com.webNoter.Entity.SubFolders;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubFolderRepository extends MongoRepository<SubFolders,String> {
}
