package com.booktrack.service;

import com.booktrack.dto.LivroRequestDTO;
import com.booktrack.exception.ResourceNotFoundException;
import com.booktrack.model.Livro;
import com.booktrack.model.LivroStatus;
import com.booktrack.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivroService {

    @Autowired
    private LivroRepository repository;

    // Listar todos os livros, opcionalmente filtrando por status
    public List<Livro> listarTodos(LivroStatus status) {
        if (status != null) {
            return repository.findByStatus(status);
        }
        return repository.findAll();
    }

    // Buscar um livro por ID
    public Livro buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado com id: " + id));
    }

    // Criar um novo livro
    public Livro salvar(LivroRequestDTO dto) {
        Livro livro = new Livro();
        livro.setTitulo(dto.getTitulo());
        livro.setAutor(dto.getAutor());
        livro.setAno(dto.getAno());
        livro.setGenero(dto.getGenero());
        livro.setStatus(dto.getStatus());
        livro.setNota(dto.getNota());
        livro.setComentario(dto.getComentario());
        // criadoEm é preenchido automaticamente no @PrePersist da entidade
        return repository.save(livro);
    }

    // Atualizar um livro existente
    public Livro atualizar(Long id, LivroRequestDTO dto) {
        Livro livro = buscarPorId(id); // reutiliza o método que lança exceção se não existir
        livro.setTitulo(dto.getTitulo());
        livro.setAutor(dto.getAutor());
        livro.setAno(dto.getAno());
        livro.setGenero(dto.getGenero());
        livro.setStatus(dto.getStatus());
        livro.setNota(dto.getNota());
        livro.setComentario(dto.getComentario());
        return repository.save(livro);
    }

    // Deletar um livro
    public void deletar(Long id) {
        Livro livro = buscarPorId(id);
        repository.delete(livro);
    }
}