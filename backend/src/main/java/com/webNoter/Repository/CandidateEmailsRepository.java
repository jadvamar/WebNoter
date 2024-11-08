package com.webNoter.Repository;

import com.webNoter.Entity.CandidateEmails;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateEmailsRepository extends MongoRepository<CandidateEmails,String> {
}