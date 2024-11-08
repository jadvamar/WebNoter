package com.webNoter.Repository;

import com.webNoter.Entity.NotesData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotesDataRepository extends MongoRepository<NotesData,String> {
}
