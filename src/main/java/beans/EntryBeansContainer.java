package beans;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.persistence.Query;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class EntryBeansContainer implements Serializable {

    private List<EntryBean> entryBeansContainer;

    private EntityManager entityManager;
    private EntityTransaction transactions;


    public EntryBeansContainer() {
        entryBeansContainer = new ArrayList<>();
        establishConnectionWithDB();
        loadAllEntries();
    }

    private void establishConnectionWithDB() {
        entityManager = Persistence.createEntityManagerFactory("persist").createEntityManager();
        transactions = entityManager.getTransaction();
    }

    private void loadAllEntries() {
        try {
            transactions.begin();
            Query query = entityManager.createQuery("SELECT e FROM EntryBean e");
            entryBeansContainer = query.getResultList();
            transactions.commit();
        } catch (Exception e) {
            if (transactions.isActive()) {
                transactions.rollback();
            }
            throw e;
        }
    }

    public void addEntry(EntryBean entry) {
        try {
            transactions.begin();
            entityManager.persist(entry);
            transactions.commit();
        } catch (Exception e) {
            if (transactions.isActive()) {
                transactions.rollback();
            }
            throw e;
        }
    }



//    public EntryBeansContainer(List<EntryBean> entryBeans) {
//        this.entryBeansContainer = entryBeans;
//    }

    public List<EntryBean> getEntryBeansContainer() {
        return entryBeansContainer;
    }

//    public void setEntryBeansContainer(List<EntryBean> entryBeansContainer) {
//        this.entryBeansContainer = entryBeansContainer;
//    }

}
