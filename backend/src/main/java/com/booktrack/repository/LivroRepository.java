package com.booktrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.booktrack.model.Livro;
import com.booktrack.model.LivroStatus;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {
    List<Livro> findByStatus(LivroStatus status);
}