package com.webNoter.Repository;

import com.webNoter.Entity.NotesData;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotesDataRepository extends MongoRepository<NotesData,ObjectId> {
    List<NotesData> findBysubFolderId(String subFolderId);

    Optional<NotesData> findById(String Id);
    Optional<NotesData> findById(ObjectId id);
}
